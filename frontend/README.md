# 🍪 MERN Stack — Refresh Token Cookie Issue & Fix

## 📋 Problem Summary

MERN stack project mein **httpOnly cookie** mein store kiya hua refresh token React app se call karne par nahi mil raha tha, lekin Postman se same API call karne par sahi kaam kar raha tha.

**Error:**
```json
{ "success": false, "message": "refresh token not found" }
```

---

## 🔍 Root Cause

### Postman vs Browser ka Fark

| | Postman | Browser |
|---|---|---|
| Cookies | Automatically bhejta hai | Tabhi bhejta hai jab `credentials: include` ho |
| CORS | Check nahi karta | Strictly enforce karta hai |
| SameSite | Ignore karta hai | Strictly enforce karta hai |
| Cross-origin | Allow karta hai | Block karta hai |

### Asal Problem — Cross-Origin Cookie Issue

Frontend `http://localhost:5173` (Vite) aur Backend `http://localhost:7474` (Express) alag-alag **ports** par chal rahe the. Browser ki security policy ke wajah se:

- Cookie ek origin (port `7474`) par set hoti hai
- Browser doosre origin (port `5173`) se request aane par cookie **send nahi karta**
- Isliye `req.cookies.refreshToken` backend mein `undefined` aata tha

---

## 🧪 Debugging Steps Jo Kiye

### 1. Network Tab Check
Chrome DevTools → Network Tab mein dekha:
```
Request URL: http://localhost:7474/api/user/refresh-token
Status Code: 401 Unauthorized
Response: { "success": false, "message": "refresh token not found" }
```

### 2. Backend Console Log
```js
export const refreshToken = async (req, res) => {
  console.log("All cookies:", req.cookies);       // {} — empty!
  console.log("RefreshToken:", req.cookies.refreshToken); // undefined
}
```

Cookies object bilkul empty aa raha tha — matlab browser cookie bhej hi nahi raha tha.

---

## ✅ Solution — Vite Proxy Setup

### Vite Proxy kya karta hai?

Vite dev server ko ek **proxy** ki tarah configure kiya jata hai. Jab React app `/api` route call karta hai, Vite us request ko internally backend server par forward kar deta hai — browser ki nazar mein dono **same origin** par hote hain, isliye cookie bina kisi issue ke set aur send hoti hai.

```
Browser (5173) → /api/user/login
        ↓  (Vite internally forward karta hai)
Backend (7474) → /api/user/login
        ↓
Cookie set hoti hai same origin par ✅
```

### Step 1 — `vite.config.js` mein proxy add karo

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7474',  // Backend ka URL
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

### Step 2 — `DB_URL` update karo

```js
// ❌ Pehle — full URL dena padta tha
export const DB_URL = "http://localhost:7474/api"

// ✅ Ab — sirf path dena hai, Vite proxy handle karega
export const DB_URL = "/api"
```

### Step 3 — Axios calls mein `withCredentials` rakho

```js
// Refresh token call
const res = await axios.get(DB_URL + "/user/refresh-token", {
  withCredentials: true
})

// Logout call (yeh bhi zaroori hai)
const res = await axios.get(DB_URL + "/user/logout", {
  withCredentials: true
})
```

---

## 📁 Final Working Code

### Backend — `server.js`

```js
import express from "express"
import cors from "cors"
import CookieParser from "cookie-parser"
import dotenv from "dotenv"

dotenv.config()
const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))
app.use(express.json())
app.use(CookieParser()) // ← req.cookies ke liye zaroori
app.use("/api/user", userRoutes)

app.listen(7474, () => console.log("Server running on port 7474"))
```

### Backend — Cookie Set karna (Auth Controller)

```js
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  sameSite: "lax",
  secure: false,    // Production mein true karna
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
})
```

### Frontend — `vite.config.js`

```js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7474',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

### Frontend — `variables.js`

```js
export const DB_URL = "/api"  // Sirf path, full URL nahi
```

### Frontend — `App.jsx` (Refresh Token Call)

```js
const refreshToken = async () => {
  try {
    const res = await axios.get(DB_URL + "/user/refresh-token", {
      withCredentials: true,  // ← Cookie bhejne ke liye zaroori
    })

    if (res.data.success) {
      dispatch(setAccessToken(res?.data?.accessToken))
      Cookies.set("accessToken", res?.data?.accessToken, {
        expires: new Date(new Date().getTime() + 30 * 60 * 1000)
      })
      return await checkAuth(true)
    }
  } catch (error) {
    if (error.response?.status === 401) return handleLogOut()
    dispatch(setIsLoading(false))
  }
}
```

---

## ⚠️ Production ke liye Important Notes

Vite proxy sirf **development** mein kaam karta hai. Production mein deploy karte waqt:

### Option 1 — Same Domain par Deploy karo (Recommended)
```
Frontend: https://yourdomain.com
Backend:  https://yourdomain.com/api
```

### Option 2 — Alag Domain par Deploy karo
Cookie options update karne honge:
```js
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  sameSite: "none",  // Cross-origin ke liye
  secure: true,      // HTTPS zaroori hai sameSite: none ke saath
  path: "/",
})
```

Aur CORS mein production frontend URL dena hoga:
```js
app.use(cors({
  origin: "https://your-frontend-domain.com",
  credentials: true,
}))
```

---

## 🎯 Key Takeaways

1. **httpOnly cookie** JavaScript se access nahi hoti — yeh security feature hai, bug nahi
2. **Browser** cross-origin requests mein cookies tabhi bhejta hai jab `credentials: 'include'` ho
3. **Postman** CORS aur SameSite policies enforce nahi karta — isliye wahan kaam karta tha
4. **Vite Proxy** development mein cross-origin problem ka sabse aasan solution hai
5. **`withCredentials: true`** axios mein aur **`credentials: 'include'`** fetch mein hamesha lagana chahiye jab cookies involve hon

---

## 📦 Dependencies

```json
{
  "backend": {
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0"
  },
  "frontend": {
    "axios": "^1.6.0",
    "js-cookie": "^3.0.5"
  }
}
```