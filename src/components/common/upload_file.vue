<template>
  <el-upload
      class="avatar-uploader"
      :action="actionUrl"
      :headers="headers"
      :show-file-list="false"
      :on-success="fSuccess"
      :on-error="fError"
      :before-upload="fBeforeUpload"
      :accept="extension?extension:'.png,.jpg,.jpeg,.bmp'"
  >
    <el-icon class="avatar-uploader-icon">
      <Plus/>
    </el-icon>
  </el-upload>
</template>

<script>
import {reactive, toRefs} from "vue";
import {getToken} from '@/libs/util'
import commonFunc from '@/libs/common_func'

export default {
  name: "UploadFile",
  components: {},
  props: {
    extension:String
  },
  emits: ['fUploadCallback'],
  setup(props, context) {
    const {extension} = toRefs(props)

    const stateData = reactive({
      actionUrl: commonFunc.getApiUrlPre() + '/upload/files',
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
    })

    const fBeforeUpload = () => {

    }
    // 上传成功后的回调
    // @res 上传成功返回的结果
    // @uploadFile 被上传的文件路径信息
    const fSuccess = (res, uploadFile) => {
      if (res.code === 200) {
        context.emit('fUploadCallback', res.data.path, commonFunc.getServerIp() + res.data.path)
      } else {
        commonFunc.Curd.FailTips("文件上传失败：" + res.msg)
      }
    }
    //上传失败后的回调
    // @errRes 上传失败返回的结果
    // @uploadFile 被上传的文件路径信息
    const fError=(errRes, uploadFile)=>{
     const err= JSON.parse(errRes.message)
      commonFunc.Curd.FailTips("文件上传失败：" + err.msg)
    }

    return {
      ...toRefs(stateData),

      fBeforeUpload,
      fSuccess,
      fError,
      extension
    }
  }
}
</script>

<style scoped>
.avatar-uploader {
  width: 50px;
  height: 50px;
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
  width: 48px;
  height: 48px;
  text-align: center;
}
</style>
