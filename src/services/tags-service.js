import HttpRequest from './http-request';
import Emitter from './event-emitter';

export const TAG_LIST_UPDATED = 'TAG_LIST_UPDATED';

export default class TagsService {
  static getTags() {
    return HttpRequest.Get('api/tags');
  }

  static getTag(id) {
    return HttpRequest.Get(`api/tags/${id}`);
  }

  static createTag(tagName) {
    const data = {
      tagName: tagName,
    };
    return HttpRequest.Post(`api/tags`, JSON.stringify(data)).then(_ => Emitter.emit(TAG_LIST_UPDATED, {}));
  }

  static updateTagName(id, tagName) {
    const data = {
      tagName: tagName
    };
    return HttpRequest.Put(`api/tags/${id}`, JSON.stringify(data)).then(_ => Emitter.emit(TAG_LIST_UPDATED, {}));
  }

  static deleteTag(id) {
    return HttpRequest.Delete(`api/tags/${id}`).then(_ => Emitter.emit(TAG_LIST_UPDATED, {}));
  }
}
