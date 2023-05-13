import Modal from 'flarum/common/components/Modal';
import Croppie from "croppie";

export default class ModalWeight extends Modal {
  static isDismissible = true;

  oninit(vnode) {
    super.oninit(vnode);
  }

  className() {
    // Custom CSS classes to apply to the modal
    return 'custom-modal-class';
  }
  onready() {
    super.onready();

    let index = this.attrs.index;
    // 创建一个Croppie实例
    let c = new Croppie(document.getElementById('upload-preview'), {
      viewport: { width: 200, height: 200, type: 'square' },
      boundary: { width: 300, height: 300 },
      showZoomer: false,
      enableExif: true,
      enableOrientation: true
    });

    console.log(c);

    // 选择图片按钮点击事件
    document.getElementById('upload-button').addEventListener('click', function () {
      document.getElementById('upload-input').click();
    });

    // 上传图片事件
    document.getElementById('upload-input').addEventListener('change', function (e) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = function (event) {
        c.bind({
          url: event.target.result
        });
      };

      reader.readAsDataURL(file);

      document.getElementById('upload-button').style.display = 'none';
      document.getElementById('crop-button').style.display = 'block';
    });

    function base64toFile(dataurl, filename) {
      let arr = dataurl.split(',');
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split('/')[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      });
    }

    // 裁剪按钮点击事件
    document.getElementById('crop-button').addEventListener('click', function () {
      c.result('base64').then(function (base64) {
        // 在这里可以将base64字符串发送到服务器保存
        const user = index.attrs.user;
        const data = new FormData();
        data.append('avatar', base64toFile(base64));

        app
          .request({
            method: 'POST',
            url: `${app.forum.attribute('apiUrl')}/users/${user.id()}/avatar`,
            serialize: (raw) => raw,
            body: data,
          })
          .then(index.success.bind(index), index.failure.bind(index)).then(() => {
            app.modal.close()
        });
      });
    });
  }

  title() {
    return app.translator.trans('flarum-avatar-cropper.forum.modal-title');
  }

  content() {
    // Content to show in the modal's body
    return <div id="upload-container">
      <div id="upload-preview"></div>
      <input type="file" id="upload-input" style="display: none;"></input>
      <button id="upload-button" className="Button Button--primary IndexPage-newDiscussion hasIcon" style="float: right; margin-bottom: 20px; margin-right: 20px;">选择图片</button>
      <button id="crop-button" className="Button Button--primary IndexPage-newDiscussion hasIcon" style="display: none; float: right; margin-bottom: 20px; margin-right: 20px;">裁剪</button>
    </div>;
  }

  onsubmit(e) {
    e.preventDefault();
    // If your modal contains a form, you can add form processing logic here.
  }
}
