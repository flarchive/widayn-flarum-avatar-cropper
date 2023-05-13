import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import AvatarEditor from 'flarum/forum/components/AvatarEditor';
import Button from 'flarum/common/components/Button';
import ModalWeight from "../common/components/ModalWeight";

app.initializers.add('widayn/flarum-avatar-cropper', () => {
  override(AvatarEditor.prototype, 'quickUpload', function (original, e){
    if (!this.attrs.user.avatarUrl()) {
      e.preventDefault();
      e.stopPropagation();
      app.modal.show(ModalWeight, {'index':this})
    }
  })

  extend(AvatarEditor.prototype, 'controlItems', function (items) {
    function openUpload(e) {
      if (e.loading) return;

      app.modal.show(ModalWeight, {'index':this})
    }

    items.replace(
      'upload',
      <Button icon="fas fa-upload" onclick={openUpload.bind(this)}>
        {app.translator.trans('core.forum.user.avatar_upload_button')}
      </Button>
    );
  })
});
