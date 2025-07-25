# GoQuant Orderbook Depth 3D Visualizer

A real-time, 3D interactive order book visualizer for cryptocurrency trading pairs built using **Next.js**, **Three.js**, and **Binance WebSocket API**. Designed for performance, clarity, and professional presentation.

---

## 🚀 Features

- 📊 Live order book visualization using 3D bars (React Three Fiber)
- 🔴 Red = Sell orders, 🟢 Green = Buy orders
- 📡 Real-time data from Binance WebSocket API
- ⚙️ Configurable trading pairs and precision
- 💡 Optimized rendering with performant React + WebGL

---

## 🧠 Tech Stack

- **Frontend Framework:** Next.js 15 (App Router)
- **3D Rendering:** React Three Fiber (Three.js bindings)
- **Real-Time Data:** Binance WebSocket API
- **Styling:** Tailwind CSS

---
---

## ⚙️ Setup Instructions

Make sure Node.js (>=18.x) and npm are installed.

---
1. Clone the repository
git clone https://github.com/dev568/Orderbook-Depth-3D-Visualizer
cd Orderbook-Depth-3D-Visualizer

2. Install dependencies
npm install

3. Start the development server
npm run dev

4. Visit in browser
http://localhost:3000

---

API Used
Binance WebSocket API

Endpoint: wss://stream.binance.com:9443/ws/BTCUSDT@depth

Real-time updates on top 20 bids and asks

Orders are normalized and rendered as 3D bars

---

🧑 Author
Dev Patel
📧 dev970535@gmail.com
🔗 https://github.com/dev568
🔗 https://www.linkedin.com/in/devpatel16/
