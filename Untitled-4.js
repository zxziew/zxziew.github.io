            `You are Sunny English voice helper for children. Answer in Russian or Kazakh depending on the question. Keep it warm, simple, and short. If you give English examples, include a simple explanation.`
          );
          addMessage(answer, "bot");
          status.textContent = "Готово. Можно задать следующий вопрос.";
          speak(answer, "ru-RU");
        } catch (error) {
          const message = error.message === "NO_KEY"
            ? "Нужен Gemini API-ключ. Откройте настройки ⚙️ и сохраните ключ."
            : "Ошибка: " + (error.message || error);
          addMessage(message, "bot");
          status.textContent = "Проверьте настройки.";
        }
      }

      sendQuestion.addEventListener("click", () => {
        const value = textQuestion.value;
        textQuestion.value = "";
        ask(value);
      });

      textQuestion.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          sendQuestion.click();
        }
      });

      if (Recognition) {
        recognition = new Recognition();
        recognition.lang = "kk-KZ";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript || "";
          voiceButton.classList.remove("listening");
          ask(transcript);
        };

        recognition.onerror = () => {
          voiceButton.classList.remove("listening");
          status.textContent = "Не удалось распознать голос. Можно написать вопрос текстом.";
        };

        recognition.onend = () => {
          voiceButton.classList.remove("listening");
        };
      }

      voiceButton.addEventListener("click", () => {
        if (!hasGeminiKey()) {
          status.textContent = "Сначала сохраните API-ключ.";
          openSettings();
          return;
        }

        if (!recognition) {
          status.textContent = "В этом браузере голосовой ввод недоступен. Напишите вопрос текстом.";
          return;
        }

        try {
          recognition.start();
          voiceButton.classList.add("listening");
          status.textContent = "Слушаю...";
        } catch (_) {
          recognition.stop();
        }
      });
    }

    function openSettings() {
      const card = document.getElementById("settingsCard");
      const input = document.getElementById("apiKeyInput");
      card.classList.add("open");
      input.value = localStorage.getItem(GEMINI_KEY_STORAGE) || "";
      input.focus();
    }

    function initSettings() {
      const card = document.getElementById("settingsCard");
      const input = document.getElementById("apiKeyInput");
      const notice = document.getElementById("settingsNotice");
      document.getElementById("settingsToggle").addEventListener("click", (event) => {
        event.stopPropagation();
        if (card.classList.contains("open")) card.classList.remove("open");
        else openSettings();
      });

      document.getElementById("saveKeyBtn").addEventListener("click", () => {
        const value = input.value.trim();
        if (value) {
          localStorage.setItem(GEMINI_KEY_STORAGE, value);
          notice.textContent = "Ключ сохранен.";
        } else {
          localStorage.removeItem(GEMINI_KEY_STORAGE);
          notice.textContent = "Ключ пустой, Gemini отключен.";
        }
        const keyStatus = document.getElementById("keyStatus");
        if (keyStatus) keyStatus.textContent = hasGeminiKey() ? "✅ API-ключ сохранен" : "⚙️ API-ключ нужен";
      });

      document.getElementById("clearKeyBtn").addEventListener("click", () => {
        input.value = "";
        localStorage.removeItem(GEMINI_KEY_STORAGE);
        notice.textContent = "Ключ удален.";
      });

      document.addEventListener("click", (event) => {
        if (!card.contains(event.target) && event.target.id !== "settingsToggle") {
          card.classList.remove("open");
        }
      });
    }

    initSettings();

    if (currentPage === "home") renderHome();
    else if (currentPage === "alphabet") renderAlphabet();
    else if (currentPage === "daily") renderDaily();
    else if (currentPage === "words") renderWords();
    else if (currentPage === "reading") renderReading();
    else if (currentPage === "media") renderMedia();
    else if (currentPage === "assistant") renderAssistant();
    else renderHome();
  </script>
</body>
</html>