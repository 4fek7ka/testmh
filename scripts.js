document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  const initialScreen = document.getElementById("initialScreen");
  const mainContent = document.getElementById("mainContent");
  const music = document.getElementById("birthdayMusic");
  const envelopeContainer = document.getElementById("envelopeContainer");
  const envelopeAnimation = document.getElementById("envelopeAnimation");
  const letter = document.getElementById("letter");
  const giftAnimation = document.getElementById("giftAnimation"); // Подключаем элемент подарка
  const birdsContainer = document.getElementById("birdsContainer");

  console.log("Инициализация начальной страницы...");

  startButton.addEventListener("click", () => {
    console.log("Кнопка нажата. Начинаем переход...");
    music.volume = 0.25;
    // Плавное исчезновение первой страницы
    initialScreen.classList.add("hidden");
    envelopeAnimation.stop();

    // Переход ко второй странице
    setTimeout(() => {
      initialScreen.style.display = "none";
      mainContent.style.display = "flex";
      mainContent.classList.remove("hidden");

      // Инициализация частиц
      tsParticles
        .load("tsparticles", particlesConfig)
        .then(() => console.log("Частицы успешно загружены."))
        .catch((err) => console.error("Ошибка при загрузке частиц:", err));

      // Плавное появление конверта
      setTimeout(() => {
        envelopeContainer.classList.add("visible");
        console.log("Конверт отображён.");

        envelopeAnimation.addEventListener("ready", () => {
          console.log("Анимация готова. Устанавливаем закрытое состояние.");
          envelopeAnimation.seek(0);
          envelopeAnimation.stop();
        });

        envelopeAnimation.addEventListener("mouseenter", () => {
          console.log("Наведение на конверт. Запуск анимации открытия.");
          envelopeAnimation.play();
        });

        envelopeAnimation.addEventListener("mouseleave", () => {
          console.log("Курсор убран. Возвращение к началу анимации.");
          envelopeAnimation.stop();
        });

        // Добавляем логику клика по конверту
        envelopeAnimation.addEventListener("click", () => {
          console.log("Конверт открыт. Запуск конфетти и показ письма.");

          // Запуск конфетти
          confetti({
            particleCount: 200, // Количество частиц за раз
            spread: 360, // Радиус разброса
            startVelocity: 40, // Начальная скорость
            origin: { x: 0.5, y: 0.5 }, // Центр экрана
            gravity: 0.8,
            colors: ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"], // Цвета конфетти
          });

          // Показ письма
          letter.classList.remove("hidden");
          letter.classList.add("visible");

          // Задержка для показа подарка через 15 секунд
          setTimeout(() => {
            giftAnimation.classList.add("visible"); // Показываем подарок
          }, 10000); // 15 секунд
        });
      }, 2000);

      // Запуск музыки
      music.play();
      console.log("Музыка запущена.");
    }, 2000);
  });

  // Обработчик для подарка
  giftAnimation.addEventListener("click", () => {
    console.log("Подарок был кликнут");

    // Останавливаем музыку
    let fadeOutInterval = setInterval(() => {
      if (music.volume > 0.05) {
        music.volume -= 0.001; // Уменьшаем громкость постепенно
      } else {
        clearInterval(fadeOutInterval);
        music.pause();
        music.volume = 1.0; // Восстанавливаем громкость для следующего проигрывания
        console.log("Музыка остановлена.");

        // Включаем новую музыку **Только один раз**
        playNewMusic();
      }
    }, 12);

    // Плавное исчезновение подарка и письма
    giftAnimation.style.opacity = 0;
    letter.style.opacity = 0;

    // Прячем элементы через некоторое время
    setTimeout(() => {
      giftAnimation.style.display = "none";

      // Плавное появление фона с птичками
      const birdsContainer = document.getElementById("birdsContainer");
      birdsContainer.style.display = "block";
      setTimeout(() => {
        birdsContainer.style.opacity = 1; // Плавно проявляем
      }, 100); // Небольшая задержка перед проявлением
    }, 1000);

    // Включаем анимацию птичек
    birdsContainer.style.display = "block"; // Показываем контейнер с птичками
    console.log("Контейнер для птичек теперь видим.");

    try {
      console.log("Инициализация анимации птичек...");
      if (typeof VANTA !== "undefined") {
        VANTA.BIRDS({
          el: "#birdsContainer", // Делаем фон на весь экран
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 100.0, // Меняем на 100vh
          minWidth: 100.0, // Меняем на 100vw
          scale: 1.0,
          scaleMobile: 1.0,
          birdSize: 1.3,
          wingSpan: 27.0,
          speedLimit: 8.0,
          separation: 24.0,
          alignment: 35.0,
          cohesion: 45.0,
          birdSize: 1,
          colorMode: "lerp",
          color1: 0x00a9a5,
          color2: 0xfcdebe,
        });
        console.log("Анимация птичек инициализирована успешно.");
      } else {
        console.error("VANTA не определен.");
      }
    } catch (error) {
      console.error("Ошибка при инициализации анимации птичек:", error);
    }
  });
  function playNewMusic() {
    let newMusic = new Audio("bird.mp3"); // Укажи путь к файлу с новой музыкой
    newMusic.volume = 0; // Начинаем с нулевой громкости
    newMusic.loop = true; // Зацикливаем
    newMusic.play();
    console.log("Новая музыка запущена.");

    // Плавное увеличение громкости
    let fadeInInterval = setInterval(() => {
      if (newMusic.volume < 0.1) {
        newMusic.volume += 0.001;
      } else {
        clearInterval(fadeInInterval);
        newMusic.volume = 0.1; // Устанавливаем окончательную громкость
      }
    }, 20);
  }
});
