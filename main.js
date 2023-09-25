/// Main JS file
/// Author: Luca Jost

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    console.log(entry)
    if (entry.isIntersecting) {
      entry.target.classList.add('show')
    }
  })
})

const hiddenElements = document.querySelectorAll('.hidden')
hiddenElements.forEach(element => observer.observe(element))

document.addEventListener('mousemove', (e) => {
  // Update the cursor position to follow the mouse
  cursor.style.left = e.pageX + 'px'
  cursor.style.top = e.pageY + 'px'
})

document.addEventListener('mouseenter', () => {
  // Show the cursor when it enters the document
  cursor.style.opacity = 0.05
})

document.addEventListener('mouseleave', () => {
  // Hide the cursor when it leaves the document
  cursor.style.opacity = 0
})

const cursor = document.querySelector('.cursor')
