// اكتب بيانات EmailJS الخاصة بك هنا
const EMAILJS_PUBLIC_KEY = "ضع_Public_Key_هنا";
const EMAILJS_SERVICE_ID = "ضع_Service_ID_هنا";
const EMAILJS_TEMPLATE_ID = "ضع_Template_ID_هنا";

// تشغيل التاريخ
const todayElement = document.getElementById("today");

const today = new Date();

todayElement.textContent = today.toLocaleDateString("ar-EG", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
});

// بيانات التمارين
const workouts = {
  push: [
    "Bench Press - صدر",
    "Incline Dumbbell Press - صدر علوي",
    "Overhead Shoulder Press - أكتاف",
    "Lateral Raises - أكتاف جانبي",
    "Tricep Pushdown - تراي"
  ],

  pull: [
    "Lat Pulldown - ظهر",
    "Barbell Row - ظهر",
    "Seated Cable Row - ظهر",
    "Face Pull - أكتاف خلفي",
    "Barbell Curl - باي"
  ],

  legs: [
    "Squat - أرجل",
    "Leg Press - أرجل",
    "Leg Extension - أمامي",
    "Leg Curl - خلفي",
    "Calf Raises - سمانة"
  ],

  upper: [
    "Bench Press - صدر",
    "Pull Ups - ظهر",
    "Shoulder Press - أكتاف",
    "Barbell Curl - باي",
    "Tricep Pushdown - تراي"
  ],

  lower: [
    "Squat - أرجل",
    "Romanian Deadlift - خلفية",
    "Leg Press - أرجل",
    "Leg Curl - خلفي",
    "Calf Raises - سمانة"
  ]
};

let selectedDay = "";
let selectedExercises = [];

function showWorkout(day) {
  selectedDay = day;
  selectedExercises = workouts[day];

  const title = document.getElementById("day-title");
  const list = document.getElementById("exercise-list");

  title.textContent = getDayName(day);
  list.innerHTML = "";

  selectedExercises.forEach(function (exercise, index) {
    const exerciseBox = document.createElement("div");

    exerciseBox.className = "exercise";

    exerciseBox.innerHTML = `
      <h3>${index + 1}. ${exercise}</h3>

      <div class="exercise-inputs">
        <input
          type="number"
          min="0"
          class="weight"
          placeholder="الوزن بالكجم"
        >

        <input
          type="number"
          min="0"
          class="reps"
          placeholder="عدد العدات"
        >

        <input
          type="number"
          min="0"
          class="sets"
          placeholder="المجموعات"
        >
      </div>
    `;

    list.appendChild(exerciseBox);
  });
}

function getDayName(day) {
  const names = {
    push: "يوم الدفع Push",
    pull: "يوم السحب Pull",
    legs: "يوم الأرجل Legs",
    upper: "يوم الجزء العلوي Upper",
    lower: "يوم الجزء السفلي Lower"
  };

  return names[day];
}

function collectWorkoutData() {
  if (!selectedDay) {
    alert("اختر يوم التمرين أولًا");
    return null;
  }

  const exercises = document.querySelectorAll(".exercise");
  let workoutText = `${getDayName(selectedDay)}\n\n`;

  exercises.forEach(function (exercise, index) {
    const weight = exercise.querySelector(".weight").value || "غير محدد";
    const reps = exercise.querySelector(".reps").value || "غير محدد";
    const sets = exercise.querySelector(".sets").value || "غير محدد";

    workoutText +=
      `${index + 1}. ${selectedExercises[index]}\n` +
      `الوزن: ${weight} كجم | العدات: ${reps} | المجموعات: ${sets}\n\n`;
  });

  return workoutText;
}

function saveWorkout() {
  const workoutData = collectWorkoutData();

  if (workoutData) {
    localStorage.setItem("workoutData", workoutData);
    alert("تم حفظ بيانات التمرين بنجاح");
  }
}

function sendEmail() {
  const email = document.getElementById("user-email").value.trim();
  const status = document.getElementById("email-status");

  if (!selectedDay) {
    status.textContent = "اختر يوم التمرين أولًا";
    return;
  }

  if (!email) {
    status.textContent = "اكتب بريدك الإلكتروني أولًا";
    return;
  }

  const workoutData = collectWorkoutData();

  if (!workoutData) {
    return;
  }

  // تأكد من وضع بيانات EmailJS الحقيقية
  if (
    EMAILJS_PUBLIC_KEY.includes("ضع_") ||
    EMAILJS_SERVICE_ID.includes("ضع_") ||
    EMAILJS_TEMPLATE_ID.includes("ضع_")
  ) {
    status.textContent = "يجب إعداد بيانات EmailJS داخل ملف script.js";
    return;
  }

  emailjs.init(EMAILJS_PUBLIC_KEY);

  const templateParams = {
    to_email: email,
    user_email: email,
    workout_date: today.toLocaleDateString("ar-EG"),
    workout_data: workoutData
  };

  status.textContent = "جاري إرسال البريد...";

  emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    templateParams
  )
  .then(function () {
    status.textContent = "تم إرسال جدول التمرين بنجاح";
    status.style.color = "green";
  })
  .catch(function (error) {
    console.error("EmailJS Error:", error);

    status.textContent =
      "حدث خطأ في الإرسال. تأكد من إعدادات EmailJS";
    status.style.color = "red";
  });
}
