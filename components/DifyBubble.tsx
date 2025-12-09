"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    difyChatbotConfig?: any;
  }
}

export default function DifyBubble() {
  useEffect(() => {
    // 确保在客户端执行
    if (typeof window === "undefined") return;

    const initDify = () => {
      // 1. Set the Dify config on window, using my original values
      window.difyChatbotConfig = {
        token: "ttjY0VdvlBN5Q5vA",
        baseUrl: "http://dify.ailinkxin.com",
        inputs: {},
        systemVariables: {},
        userVariables: {},
      };

      console.log("Dify config set:", window.difyChatbotConfig);

      // 2. If the script is already injected, do nothing
      // 使用与原始代码相同的 ID (token 值)
      const existingScript = document.getElementById("ttjY0VdvlBN5Q5vA");
      if (existingScript) {
        console.log("Dify script already exists");
        return;
      }

      // 3. Dynamically inject the Dify embed script
      // 使用与原始代码相同的 ID 和 defer 属性
      const script = document.createElement("script");
      script.id = "ttjY0VdvlBN5Q5vA";
      script.src = "http://dify.ailinkxin.com/embed.min.js";
      script.defer = true;

      script.onload = () => {
        console.log("✅ Dify embed script loaded");
        // 等待一下让脚本初始化
        setTimeout(() => {
          const bubble = document.getElementById("dify-chatbot-bubble-button");
          if (bubble) {
            console.log("✅ Dify bubble found in DOM");
          } else {
            console.warn("⚠️ Dify bubble not found after script load");
          }
        }, 2000);
      };

      script.onerror = (error) => {
        console.error("❌ Failed to load Dify embed script:", error);
      };

      document.body.appendChild(script);
      console.log("Dify script element appended to body");
    };

    // 确保 DOM 已准备好
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initDify);
    } else {
      // DOM 已经准备好了
      initDify();
    }
  }, []);

  // This component doesn't render any visible UI
  return null;
}
