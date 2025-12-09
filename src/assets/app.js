const steps = document.querySelectorAll('.steps__item');
let currentStep = 0;

const wizardModal = document.getElementById('wizard-modal');
const stepNext = document.querySelector('[data-action="next-step"]');
const stepReset = document.querySelector('[data-action="reset-step"]');
const openWizard = document.querySelector('[data-action="open-wizard"]');
const openForm = document.querySelector('[data-action="open-form"]');
const closeModalButtons = document.querySelectorAll('[data-action="close-modal"]');
const form = document.getElementById('demo-form');
const formFeedback = document.getElementById('form-feedback');

function updateSteps(direction) {
  steps[currentStep].classList.remove('active');
  if (direction === 'reset') {
    currentStep = 0;
  } else {
    currentStep = (currentStep + 1) % steps.length;
  }
  steps[currentStep].classList.add('active');
}

function toggleModal(show) {
  wizardModal?.setAttribute('aria-hidden', show ? 'false' : 'true');
}

function pulseCharts() {
  const latency = document.getElementById('latency-value');
  const response = document.getElementById('response-value');
  const timeline = document.getElementById('uptime-timeline');

  setInterval(() => {
    const latencyValue = Math.floor(35 + Math.random() * 15);
    latency.textContent = `${latencyValue} ms`;
    const responseValue = Math.floor(100 + Math.random() * 30);
    response.textContent = `${responseValue} ms`;

    const ticks = timeline.querySelectorAll('.tick');
    const states = ['success', 'success', 'success', 'warning'];
    ticks.forEach((tick, idx) => {
      tick.classList.remove('success', 'warning');
      const state = idx === ticks.length - 2 ? states[Math.floor(Math.random() * states.length)] : 'success';
      tick.classList.add(state);
    });
  }, 3200);
}

function drawCharts() {
  const charts = [
    { id: 'chart-us', base: 72 },
    { id: 'chart-eu', base: 48 }
  ];

  charts.forEach(({ id, base }) => {
    const chart = document.getElementById(id);
    if (!chart) return;
    const bars = Array.from({ length: 7 }, (_, i) => base + Math.random() * (10 + i * 2));
    const max = Math.max(...bars);
    chart.innerHTML = bars
      .map((value) => {
        const height = ((value / max) * 100).toFixed(0);
        return `<span class="bar" style="height:${height}%;"></span>`;
      })
      .join('');
  });
}

function wireForm() {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const region = data.get('region') === 'us' ? 'ABD' : 'Avrupa';
    formFeedback.textContent = `${name}, ${region} kümesi için demo randevusu aldık. 2 iş günü içinde dönüş yapacağız.`;
    form.reset();
  });
}

function init() {
  pulseCharts();
  drawCharts();
  wireForm();

  stepNext?.addEventListener('click', () => updateSteps('next'));
  stepReset?.addEventListener('click', () => updateSteps('reset'));
  openWizard?.addEventListener('click', () => toggleModal(true));
  openForm?.addEventListener('click', () => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }));
  closeModalButtons.forEach((btn) => btn.addEventListener('click', () => toggleModal(false)));
}

init();
