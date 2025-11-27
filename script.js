// טבלת שערי המרה: כמה שקלים (ILS) שווה יחידה אחת מהמטבע
// הערכים לצורך תרגול בלבד
var ratesInILS = {
  ILS: 1,    // 1 שקל = 1 ILS
  USD: 3.7,  // 1 דולר = 3.7 ILS
  EUR: 4.0,  // 1 אירו = 4.0 ILS
  GBP: 4.5   // 1 פאונד = 4.5 ILS
};

// חיבור ל-DOM
var amountInput = document.getElementById("amountInput");
var fromCurrencySelect = document.getElementById("fromCurrency");
var toCurrencySelect = document.getElementById("toCurrency");
var convertButton = document.getElementById("convertButton");
var swapButton = document.getElementById("swapButton");
var resultTextParagraph = document.getElementById("resultText");
var toast = document.getElementById("toast");

// מאזינים
convertButton.addEventListener("click", convertCurrency);
swapButton.addEventListener("click", swapCurrencies);

amountInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    convertCurrency();
  }
});
function convertCurrency() {
  var amountValue = amountInput.value;

  // בדיקה אם ריק
  if (amountValue === "") {
    showToast("נא להקליד סכום להמרה.", "error");
    resultTextParagraph.textContent = "עדיין לא בוצעה המרה.";
    return;
  }

  var amountNumber = parseFloat(amountValue);

  // בדיקה אם מספר תקין
  if (isNaN(amountNumber) || amountNumber <= 0) {
    showToast("נא להקליד מספר חיובי בלבד.", "error");
    resultTextParagraph.textContent = "עדיין לא בוצעה המרה.";
    return;
  }

  // מקור ויעד – חשוב!
  var fromCurrency = fromCurrencySelect.value; // מ-מטבע
  var toCurrency = toCurrencySelect.value;     // אל מטבע

  // אם בחרו אותו מטבע
  if (fromCurrency === toCurrency) {
    var sameText =
      formatNumber(amountNumber) + " " + fromCurrency +
      " = " +
      formatNumber(amountNumber) + " " + toCurrency;

    resultTextParagraph.textContent = sameText;
    showToast("נבחר אותו מטבע – אין צורך בהמרה.", "success");
    return;
  }

  // שלב 1: המרה למטבע בסיס ILS
  var amountInILS = amountNumber * ratesInILS[fromCurrency];

  // שלב 2: המרה מ-ILS למטבע היעד
  var convertedAmount = amountInILS / ratesInILS[toCurrency];

  // תוצאה סופית
  var resultText =
    formatNumber(amountNumber) + " " + fromCurrency +
    " = " +
    formatNumber(convertedAmount) + " " + toCurrency;

  resultTextParagraph.textContent = resultText;
  showToast("ההמרה בוצעה בהצלחה.", "success");
}

// פונקציה לעיצוב מספר (שתי ספרות אחרי הנקודה, עם פסיק אלפי אם צריך)
function formatNumber(num) {
  // toFixed מחזיר מחרוזת, toLocaleString מוסיף פסיקים לפי פורמט
  var fixed = num.toFixed(2);
  var floatNum = parseFloat(fixed);

  // שימוש בפונקציה מובנית (זה לא מתקדם מדי לשיעור 5)
  return floatNum.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// פונקציה להחלפת מטבעות
function swapCurrencies() {
  var temp = fromCurrencySelect.value;
  fromCurrencySelect.value = toCurrencySelect.value;
  toCurrencySelect.value = temp;

  // אנימציית סיבוב
  swapButton.classList.add("spin");
  setTimeout(function () {
    swapButton.classList.remove("spin");
  }, 450);

  // אם יש סכום בשדה – מבצעים המרה מחדש
  if (amountInput.value !== "") {
    convertCurrency();
  }
}

// Toast – הצגת הודעות
function showToast(text, type) {
  toast.textContent = text;

  // איפוס קלאסים
  toast.className = "toast";

  // הוספת סוג (error/success)
  if (type === "error") {
    toast.classList.add("error");
  } else if (type === "success") {
    toast.classList.add("success");
  }

  // הצגה
  toast.classList.add("show");

  // הסרה אחרי כמה שניות
  setTimeout(function () {
    toast.classList.remove("show");
  }, 2600);
}
