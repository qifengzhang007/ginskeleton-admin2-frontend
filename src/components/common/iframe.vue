<template>
  <iframe id="iframeId" ref="iframeRef"  seamless border="0" frameborder="0" width="100%" :height="height" :src="propIframe.url"  class="iframe"></iframe>
</template>

<script>
import {reactive, toRefs} from 'vue'
import commonFunc from '@/libs/common_func'

export default {
  props: {
    propIframe: Object,
  },
  name: "Iframe",
  setup(props, context) {
    const {propIframe} = toRefs(props)

    const stateData = reactive({
      iframeRef: null,
      height: (commonFunc.GetBrowserHeight()-142)+'px'
    })

    console.log("body-height", stateData.height)

    const fObjConvUrlParams = (obj) => {
      let arr = [];
      for (const p in obj)
        if (obj.hasOwnProperty(p)) {
          arr.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      return arr.join("&");
    }

    const fReloadPage = () => {
      document.getElementById('iframeId').src = propIframe.value.url + "?" + fObjConvUrlParams(propIframe.value.params)
    }

    return {
      ...toRefs(stateData),
      propIframe,

      fReloadPage
    }
  }
}
</script>

<style scoped>

.iframe {
  left: 10px;
  right: 10px;
  top: 20px;
  bottom: 0;
  width: 100%;
  background: #fff;
  overflow: auto;
}

</style>
