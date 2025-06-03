// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.jsx';
// import './index.css';


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );

// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Hàm để khởi động MSW
async function enableMocking() {
  // Chỉ chạy MSW ở môi trường development
  // Trong vite, `import.meta.env.DEV` là cách để kiểm tra môi trường development
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser'); // Đảm bảo đường dẫn đúng
    // `worker.start()` trả về một Promise.
    // Bạn có thể muốn đợi Promise này resolve trước khi render app.
    // Tùy chọn `onUnhandledRequest: 'bypass'` cho phép các request không được mock đi qua bình thường.
    // Bạn có thể đổi thành 'warn' hoặc 'error' nếu muốn.
    return worker.start({
      onUnhandledRequest(request, print) {
        // Không warning cho các request đến HMR (Hot Module Replacement) của Vite
        if (request.url.includes('/@vite') || request.url.includes('/@react-refresh')) {
          return;
        }
        // Các request khác không được mock sẽ bị bypass (hoặc bạn có thể chọn warning/error)
        // print.warning() // Bỏ comment nếu muốn cảnh báo
      }
    });
  }
  return Promise.resolve(); // Trả về một Promise rỗng nếu không ở dev mode
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

enableMocking().then(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}).catch(err => {
  console.error("Failed to enable MSW mocking:", err);
  // Render app bình thường nếu MSW lỗi, hoặc hiển thị thông báo lỗi
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});