function copyLink() {
  let copyShortUrl = document.querySelector('#shortUrl')

  copyShortUrl.setAttribute('type', 'text')
  copyShortUrl.select()

  try {
    let successful = document.execCommand('copy')
    let msg = successful ? 'successful' : 'unsuccessful'
    alert(`The url was copied ${msg}`)
  } catch (err) {
    alert('Unable to copy the link')
  }

  // unselect the range
  copyShortUrl.setAttribute('type', 'hidden')
  window.getSelection().removeAllRanges()
}