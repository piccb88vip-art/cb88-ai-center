function typeText(node, text, speed = 18) {
  node.textContent = '';
  let i = 0;
  return new Promise(resolve => {
    const timer = setInterval(() => {
      node.textContent += text[i] || '';
      i++;
      if (i > text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}
