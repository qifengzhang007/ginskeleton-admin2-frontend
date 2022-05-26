<template>
  <el-upload
      class="avatar-uploader"
      :action="actionUrl"
      :headers="headers"
      :show-file-list="false"
      :on-success="fSuccess"
      :before-upload="fBeforeUpload"
  >
    <el-icon class="avatar-uploader-icon">
      <Plus/>
    </el-icon>
  </el-upload>
</template>

<script>
import {reactive, toRefs} from "vue";
import {getApiUrlPre, getServerIp, getToken} from '@/libs/util'
import commonFunc from '@/libs/common_func'

export default {
  name: "UploadFile",
  components: {},
  props: {},
  emits: ['fUploadCallback'],
  setup(props, context) {
    const stateData = reactive({
      actionUrl: getApiUrlPre() + '/upload/files',
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
    })

    const fBeforeUpload = () => {

    }
    // 上传成功后的回调
    const fSuccess = (res, uploadFile) => {
      if (res.code === 200) {
        context.emit('fUploadCallback', res.data.path, getServerIp() + res.data.path)
      } else {
        commonFunc.FailTips("文件上传失败：" + res.msg)
      }
    }

    return {
      ...toRefs(stateData),

      fBeforeUpload,
      fSuccess,
    }
  }
}
</script>

<style scoped>
.avatar-uploader {
  width: 60px;
  height: 60px;
  display: block;
}

</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #b7b7b7;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 58px;
  height: 58px;
  text-align: center;
}
</style>