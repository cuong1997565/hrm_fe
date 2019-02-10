export default {
  methods: {
    clickToCopy (e) {
      if (e.target.classList.contains('click-copy')) {
        e.preventDefault()
        let context = e.target.textContent.trim()
        // 1.222.222 đ => 1222222
        if ((/^[\d{1,3}\\,?\\.?]{1,}\sđ/).test(context)) {
          context = context.replace(/\D/gi, '')
        }
        this.$copyText(context).then(event => {
          e.target.classList.add('click-copied')
          setTimeout(() => {
            e.target.classList.remove('click-copied')
          }, 3000)
        })
      }
    }
  }
}
