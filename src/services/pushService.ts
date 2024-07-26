import axios from '@/modules/axios';

// Demande la permission d'envoyer des notifications
export async function askPermission(): Promise<string> {
  const permissionResult = await Notification.requestPermission();
  if (permissionResult !== 'granted') {
    throw new Error('Permission not granted for Notification');
  }
  return permissionResult;
}

// Convertit une chaîne base64 en tableau d'octets
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Abonne l'utilisateur aux notifications push
export async function subscribeUserToPush(): Promise<PushSubscription> {
  const registration = await navigator.serviceWorker.ready;
  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      'BCExnASOLyBb14wCrXiI63Gt7MIrRyBgA11r3XMtcL8TxSv-RzrQ5uI7-x7rSL31b4K1yNgEgFHZW6nQONxkUBc'
    ),
  };

  const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);
  console.log('Received PushSubscription:', JSON.stringify(pushSubscription));
  return pushSubscription;
}

// Envoie l'abonnement aux notifications push au backend
export async function sendSubscriptionToBackEnd(subscription: PushSubscription): Promise<void> {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.post('/subscribe', subscription, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!(response.data && response.data.success)) {
      throw new Error('Bad response from server.');
    }
  } catch (error) {
    throw new Error('Bad status code from server.');
  }
}

// Abonne les invités aux notifications push et stocke l'abonnement localement
export async function subscribeGuestToPush(): Promise<PushSubscription> {
  const registration = await navigator.serviceWorker.ready;
  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      'BCExnASOLyBb14wCrXiI63Gt7MIrRyBgA11r3XMtcL8TxSv-RzrQ5uI7-x7rSL31b4K1yNgEgFHZW6nQONxkUBc'
    ),
  };

  const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);
  console.log('Received PushSubscription for guest:', JSON.stringify(pushSubscription));
  localStorage.setItem('guest_push_subscription', JSON.stringify(pushSubscription));
  return pushSubscription;
}
