const CACHE_NAME = 'fitbuilder-pro-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/logo.svg',
  '/manifest.webmanifest',
  '/services/geminiService.ts',
  '/hooks/useLocalStorage.ts',
  '/contexts/AuthContext.tsx',
  '/components/OnboardingQuiz.tsx',
  '/components/Dashboard.tsx',
  '/components/Login.tsx',
  '/components/SignUp.tsx',
  '/components/Homepage.tsx',
  '/components/FitnessPlanView.tsx',
  '/components/DietPlanView.tsx',
  '/components/FoodScanner.tsx',
  '/components/Tools.tsx',
  '/components/Settings.tsx',
  '/components/Home.tsx',
  '/components/common/Button.tsx',
  '/components/common/Card.tsx',
  '/components/common/Logo.tsx',
  '/components/common/Spinner.tsx',
  '/components/common/WhatsAppChatbot.tsx',
  '/components/tools/CalorieCalculator.tsx',
  '/components/tools/Challenges.tsx',
  '/components/tools/ContentLibrary.tsx',
  '/components/tools/ExerciseTimer.tsx',
  '/components/tools/HabitTracker.tsx',
  '/components/tools/HydrationTracker.tsx',
  '/components/tools/MealPlanner.tsx',
  '/components/tools/ShoppingList.tsx',
  '/components/tools/WeightTracker.tsx',
  '/components/tools/WorkoutSchedule.tsx',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap',
  'https://esm.sh/react@^19.1.1',
  'https://esm.sh/react@^19.1.1/',
  'https://esm.sh/react-dom@^19.1.1/',
  'https://esm.sh/@google/genai@^1.15.0',
  'https://esm.sh/@heroicons/react@^2.2.0/',
  'https://esm.sh/recharts@^3.1.2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use addAll for atomic operation, but handle individual failures gracefully.
        return Promise.all(
          urlsToCache.map(url => cache.add(url).catch(e => console.warn(`Failed to cache ${url}`, e)))
        );
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache, fetch from network and cache it
        return fetch(event.request).then(
          networkResponse => {
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
