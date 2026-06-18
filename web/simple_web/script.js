const subjects = [
  'Mathematics',
  'Computer Science',
  'Physics',
  'English Literature',
  'Art & Design',
  'Biology',
];

const subjectsContainer = document.querySelector('#subjects');

subjectsContainer.innerHTML = subjects
  .map((subject) => `<span>${subject}</span>`)
  .join('');

const cards = document.querySelectorAll('.card');

cards.forEach((card, index) => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-4px)';
    card.style.transition = 'transform 180ms ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
  });

  card.style.animationDelay = `${index * 80}ms`;
});
