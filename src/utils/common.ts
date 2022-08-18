export function copyDomText(id) {
  const node = document.getElementById(id);
  if (node) {
    const createRange = document.createRange();
    createRange.selectNodeContents(document.getElementById(id));
    const selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(createRange);
    document.execCommand('Copy');
    selection.removeAllRanges();
  }
}
