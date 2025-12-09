"use client";

import { useEffect } from "react";

export default function DifyChatbot() {
  useEffect(() => {
    // 设置配置
    if (typeof window !== "undefined") {
      (window as any).difyChatbotConfig = {
        token: "ttjY0VdvlBN5Q5vA",
        baseUrl: "http://dify.ailinkxin.com",
        inputs: {},
        systemVariables: {},
        userVariables: {},
      };

      // 检查脚本是否已加载
      const existingScript = document.getElementById("ttjY0VdvlBN5Q5vA");
      if (!existingScript) {
        // 创建并加载脚本
        const script = document.createElement("script");
        script.id = "ttjY0VdvlBN5Q5vA";
        script.src = "http://dify.ailinkxin.com/embed.min.js";
        script.defer = true;
        script.onload = () => {
          console.log("Dify chatbot script loaded");
        };
        script.onerror = (e) => {
          console.error("Dify chatbot script failed to load:", e);
        };
        document.body.appendChild(script);
      }
    }
  }, []);

  return null;
}
