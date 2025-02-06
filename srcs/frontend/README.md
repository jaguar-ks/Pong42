# 🎨 Transcendance Frontend

The frontend of Transcendance is a modern, responsive single-page application built with Next.js and styled for a premium gaming experience.

## 🚀 Technologies

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [NextUI](https://nextui.org/), [Material UI](https://mui.com/)
- **Real-Time**: WebSockets for live gameplay and notifications.
- **Visuals**: [Three.js](https://threejs.org/) for 3D components and immersive UI.
- **Icons**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)

## 🎮 Game Experience

- **3D Visualization**: The Pong game is rendered using Three.js for a depth-rich, futuristic feel.
- **Real-Time Synergy**: Low-latency interaction with the Django backend via dedicated WebSocket consumers.
- **Responsive Design**: Fully optimized for various screen sizes, ensuring a consistent experience across devices.

## 📂 Project Structure

- `src/app/`: Next.js App Router pages and layouts.
- `src/components/`: Reusable UI components.
- `src/hooks/`: Custom React hooks for game logic and state.
- `src/styles/`: Global styles and Tailwind configurations.
- `assets/`: Static assets and images.

## 🛠️ Development

To run the frontend locally:
1. Install dependencies: `npm install`
2. Setup environment: Copy `.env.example` to `.env`.
3. Start dev server: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) to see the result.
