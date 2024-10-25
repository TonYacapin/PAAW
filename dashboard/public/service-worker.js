// service-worker.js
const CACHE_NAME = 'paaw-dashboard-v1';

// Define different types of caches
const CACHES = {
  static: 'static-cache-v1',
  dynamic: 'dynamic-cache-v1',
  api: 'api-cache-v1'
};
// Assets that should be cached immediately on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/static/js/main.bundle.js',
    '/static/css/main.css',
    '/assets/NVLOGO.png',
    '/assets/PAAW.png',
    // Add paths for your chart components
    '/static/js/components/AnimalHealthChartComponent.js',
    '/static/js/components/LivestockChartComponent.js',
    '/static/js/components/RegulatoryChartComponent.js',
    '/static/js/components/OffSpringMonitoringChart.js',
    '/static/js/components/UpgradingServicesChart.js',
    '/static/js/components/TechnicianQuarterlyCharts.js',
    '/static/js/components/RabiesReportChart.js',
    '/static/js/components/DiseaseInvestigationChart.js',
    '/static/js/components/VaccinationReportChart.js',
    '/static/js/components/RoutineServicesMonitoringReportChart.js',
    '/static/js/components/RabiesHistoryCharts.js',
    '/static/js/components/VeterinaryShipmentChart.js',
    '/static/js/components/SlaughterReportChart.js',
    // Add paths for your form components
    '/static/js/components/forms/RabiesVaccinationReport.js',
    '/static/js/components/forms/VaccinationReport.js',
    '/static/js/components/forms/RoutineServicesMonitoringReport.js',
    '/static/js/components/forms/DiseaseInvestigationForm.js',
    '/static/js/components/forms/RabiesHistoryForm.js',
    '/static/js/components/forms/AccomplishmentReport.js',
    '/static/js/components/forms/RSMAccomplishmentReport.js',
    '/static/js/components/forms/TechnicianQuarterlyReportForm.js',
    '/static/js/components/forms/MonthlyAccomplishmentReportUpgradingServices.js',
    '/static/js/components/forms/MonthlyAccomplishmentReportLivestock.js',
    '/static/js/components/forms/MonthlyAccomplishmentReport.js',
    '/static/js/components/forms/RequisitionIssueSlip.js',
    '/static/js/components/forms/UserManagement.js',
    '/static/js/components/forms/UpgradingServices.js',
    '/static/js/components/forms/OffspringMonitoring.js',
    '/static/js/components/forms/AnimalHealthCareServices.js',
    '/static/js/components/forms/AnimalProductionServices.js',
    '/static/js/components/forms/VeterinaryInformationServices.js',
    '/static/js/components/forms/RegulatoryCareServices.js',
    '/static/js/components/forms/EquipmentInventory.js',
    '/static/js/components/forms/DiseaseInvestigationFormLists.js',
    '/static/js/components/forms/RabiesHistoryFormLists.js',
    '/static/js/components/forms/TechnicianQuarterlyReportList.js',
    // Add offline fallback page
    '/offline.html'
  ];
  
// API endpoints to cache
const API_ROUTES = [
    '/api/entries',
    '/api/reports',
    '/api/rabies-vaccination-report',
    '/api/disease-investigation',
    '/api/vaccination-report',
    '/api/routine-services-monitoring-report',
    '/api/rabies-history',
    '/api/upgrading-services',
    '/api/offspring-monitoring',
    '/api/technician-quarterly',
    '/api/slaughterform',
    '/api/vetshipform',
    '/api/audit-log',
    '/api/inventory',
    '/api/animal-health-care-services',
    '/api/animal-production-services',
    '/api/veterinary-information-service',
    '/api/regulatory-services',
    '/api/requisitions',
    '/api/backup-restore',
    '/api/municipality-targets',
    '/api/targets',
    '/api/user',  // Assuming there's a user route for user-related operations
  ];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHES.static).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(CACHES.api).then(cache => cache.addAll(API_ROUTES.map(route => 
        new Request(route, { headers: { 'Accept': 'application/json' }})
      )))
    ])
  );
});

// Custom function to determine response strategy based on request
function getResponseStrategy(request) {
  const url = new URL(request.url);
  
  // API requests
  if (API_ROUTES.some(route => url.pathname.startsWith(route))) {
    return 'network-first';
  }
  
  // Static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    return 'cache-first';
  }
  
  // Dynamic content
  return 'network-first';
}

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const strategy = getResponseStrategy(event.request);

  switch (strategy) {
    case 'cache-first':
      event.respondWith(
        caches.match(event.request)
          .then(response => response || fetchAndCache(event.request))
          .catch(() => returnOfflineFallback())
      );
      break;

    case 'network-first':
      event.respondWith(
        fetch(event.request)
          .then(response => {
            const responseClone = response.clone();
            caches.open(CACHES.dynamic)
              .then(cache => cache.put(event.request, responseClone));
            return response;
          })
          .catch(() => caches.match(event.request))
          .catch(() => returnOfflineFallback())
      );
      break;

    default:
      event.respondWith(
        fetch(event.request)
          .catch(() => returnOfflineFallback())
      );
  }
});

// Helper function to fetch and cache
async function fetchAndCache(request) {
  const response = await fetch(request);
  const cache = await caches.open(CACHES.dynamic);
  cache.put(request, response.clone());
  return response;
}

// Helper function to return offline fallback
async function returnOfflineFallback() {
  const cache = await caches.open(CACHES.static);
  return cache.match('/offline.html');
}

// Background sync for pending form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'form-sync') {
    event.waitUntil(
      syncPendingForms()
    );
  }
});

// Helper function to sync pending forms
async function syncPendingForms() {
  const cache = await caches.open(CACHES.dynamic);
  const requests = await cache.keys();
  
  const formRequests = requests.filter(request => 
    request.method === 'POST' && 
    request.headers.get('content-type').includes('application/json')
  );

  return Promise.all(
    formRequests.map(async request => {
      try {
        const response = await fetch(request.clone());
        if (response.ok) {
          await cache.delete(request);
        }
        return response;
      } catch (error) {
        console.error('Form sync failed:', error);
      }
    })
  );
}

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => !Object.values(CACHES).includes(name))
          .map(name => caches.delete(name))
      );
    })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/assets/PAAW.png',
    badge: '/assets/NVLOGO.png'
  };

  event.waitUntil(
    self.registration.showNotification('PAAW Dashboard', options)
  );
});