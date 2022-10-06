<template>
  <iframe id="iframeId" ref="iframeRef" seamless allowtransparency="true" border="0" width="100%" :height="height" :src="propIframe.url" class="iframe"></iframe>
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
      height: (commonFunc.GetBrowserHeight() - 142) + 'px'
    })

    const fObjConvUrlParams = (obj) => {
      let arr = [];
      for (const p in obj)
        if (obj.hasOwnProperty(p)) {
          arr.push(p+ "=" + obj[p]);
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
  border: none;
  right: 10px;
  bottom: 0;
  width: 100%;
  background: #fff;
  overflow: auto;
  margin: 4px 4px 0 4px;
}

</style>
