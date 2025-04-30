import { v4 as uuidv4 } from 'uuid';

/* eslint-disable */
function getOrSetVisitorId() {
  let visitorId;
  try {
    visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = uuidv4();
      localStorage.setItem('visitorId', visitorId);
    }
  } catch (error) {
    console.error('LocalStorage error:', error);
    visitorId = uuidv4();
  }
  return visitorId;
}

const visitorId = getOrSetVisitorId();
window.visitorId = visitorId;
/* eslint-enable */
