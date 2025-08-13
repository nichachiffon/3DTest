# 🏭 Factory Dashboard

ระบบติดตามและควบคุมเครื่องจักรในโรงงานแบบ Real-time พัฒนาด้วย React, TypeScript และ Custom CSS

## ✨ คุณสมบัติ

- **Real-time Monitoring**: ติดตามสถานะเครื่องจักรแบบเรียลไทม์
- **Simulation Mode**: โหมดจำลองข้อมูลสำหรับการทดสอบ
- **Node-RED Integration**: เชื่อมต่อกับ Node-RED ผ่าน WebSocket
- **Responsive Design**: ออกแบบให้ใช้งานได้บนทุกอุปกรณ์
- **Export Data**: ส่งออกข้อมูลเป็นไฟล์ JSON
- **Control Panel**: แผงควบคุมเครื่องจักร
- **Custom CSS Styling**: สไตล์ที่สวยงามและทันสมัย

## 🚀 การติดตั้ง

1. Clone โปรเจค:
```bash
git clone <repository-url>
cd 3dtest
```

2. ติดตั้ง dependencies:
```bash
npm install
```

3. รันแอปพลิเคชัน:
```bash
npm run dev
```

4. เปิดเบราว์เซอร์ไปที่ `http://localhost:5173` (หรือพอร์ตที่แสดง)

## 🛠️ การ Build

```bash
npm run build
```

## 📁 โครงสร้างโปรเจค

```
3dtest/
├── src/
│   ├── App.tsx          # หน้าหลักของแอปพลิเคชัน
│   ├── App.css          # สไตล์เฉพาะของแอป (Custom CSS)
│   ├── index.css        # สไตล์หลักและ Tailwind CSS
│   └── main.tsx         # จุดเริ่มต้นของแอป
├── public/              # ไฟล์สาธารณะ
├── dist/                # ไฟล์ที่ build แล้ว
├── tailwind.config.js   # การตั้งค่า Tailwind CSS
├── postcss.config.js    # การตั้งค่า PostCSS
└── package.json         # Dependencies และ scripts
```

## 🎯 การใช้งาน

### โหมด Simulation
- แอปพลิเคชันจะเริ่มต้นในโหมดจำลองข้อมูล
- ข้อมูลจะอัปเดตทุก 2 วินาที
- สามารถเปิด/ปิดการจำลองได้จากปุ่มใน Settings

### การเชื่อมต่อ Node-RED
1. เปิด Settings Panel โดยคลิกที่ไอคอน Settings
2. ใส่ URL ของ Node-RED WebSocket (เช่น `ws://localhost:1880/ws/factory`)
3. กดปุ่ม "Connect"
4. เมื่อเชื่อมต่อสำเร็จ จะแสดงสถานะ "Node-RED Connected"

### การควบคุมเครื่องจักร
- **Reset All**: รีเซ็ตเครื่องจักรทั้งหมด
- **Emergency Stop**: หยุดฉุกเฉิน
- **Export Data**: ส่งออกข้อมูลเป็นไฟล์ JSON
- **Refresh Data**: อัปเดตข้อมูลใหม่

## 🎨 เทคโนโลยีที่ใช้

- **React 19**: UI Framework
- **TypeScript**: Type Safety
- **Custom CSS**: Styling (แทน Tailwind CSS)
- **Lucide React**: Icons
- **Vite**: Build Tool

## 📊 สถานะเครื่องจักร

- **OK** (สีเขียว): เครื่องจักรทำงานปกติ
- **WARN** (สีเหลือง): มีการเตือน
- **ALARM** (สีแดง): มีสัญญาณเตือน (มี animation pulse)

## 🔧 การปรับแต่ง

### การเพิ่มเครื่องจักรใหม่
แก้ไขใน `src/App.tsx` ในส่วน `useState` ของ `machines`:

```typescript
const [machines, setMachines] = useState<Machine[]>([
  { id: 'M-A', name: 'Injection Molder A', temp: 65, status: 'OK', type: 'injection', lastUpdate: new Date() },
  // เพิ่มเครื่องจักรใหม่ที่นี่
]);
```

### การปรับแต่งสีและสไตล์
แก้ไขใน `src/App.css`:

```css
/* ตัวอย่างการเปลี่ยนสีหลัก */
.dashboard-container {
  background: linear-gradient(135deg, #your-color 0%, #your-color 50%, #your-color 100%);
}

/* ตัวอย่างการเปลี่ยนสีสถานะ */
.status-badge.ok {
  color: #your-green-color;
  background-color: rgba(your-green-color, 0.2);
  border: 1px solid #your-green-color;
}
```

## 🐛 การแก้ไขปัญหา

### ปัญหา WebSocket Connection
- ตรวจสอบว่า Node-RED กำลังทำงาน
- ตรวจสอบ URL WebSocket ว่าถูกต้อง
- ตรวจสอบ Firewall และ Network settings

### ปัญหา CSS ไม่แสดง
- รัน `npm install` อีกครั้ง
- ลบโฟลเดอร์ `node_modules` และ `package-lock.json` แล้วรัน `npm install`
- ตรวจสอบว่าไฟล์ `src/App.css` ถูก import ใน `App.tsx`

### ปัญหา TypeScript Errors
- รัน `npm run build` เพื่อดู error ที่ชัดเจน
- ตรวจสอบ type annotations ใน `App.tsx`

## 🎨 สไตล์ที่ใช้

แอปพลิเคชันใช้ Custom CSS ที่ออกแบบมาให้:
- **Dark Theme**: พื้นหลังสีเข้มพร้อม gradient
- **Glassmorphism**: เอฟเฟกต์แก้วโปร่งใส
- **Responsive**: ปรับตัวตามขนาดหน้าจอ
- **Animations**: การเคลื่อนไหวที่นุ่มนวล
- **Color Coding**: สีที่แตกต่างกันตามสถานะ

## 📝 License

MIT License

## 🤝 การสนับสนุน

หากมีปัญหาหรือข้อเสนอแนะ กรุณาสร้าง Issue ใน GitHub repository

## 🔄 การอัปเดตล่าสุด

- แก้ไขปัญหา CSS ไม่แสดงโดยใช้ Custom CSS แทน Tailwind
- เพิ่มสไตล์ที่สวยงามและทันสมัย
- ปรับปรุงการแสดงผลให้ responsive
- เพิ่ม animations และ transitions
