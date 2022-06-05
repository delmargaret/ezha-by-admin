import HttpRequest from './http-request';
import Emitter from './event-emitter';

export const CATEGORIES_LIST_UPDATED = 'CATEGORIES_LIST_UPDATED';

export default class CategoriesService {
  static getCategories(cateringFacilityId) {
    return HttpRequest.Get(
      `api/catering-facilities/${cateringFacilityId}/categories`
    );
  }

  static createCategory(cateringFacilityId, name) {
    let data = {
      categoryName: name
    };
    return HttpRequest.Post(
      `api/catering-facilities/${cateringFacilityId}/categories`,
      JSON.stringify(data)
    ).then(_ => Emitter.emit(CATEGORIES_LIST_UPDATED, {}));
  }

  static updateCategoryName(cateringFacilityId, id, name) {
    let data = {
      categoryName: name
    };
    return HttpRequest.Put(
      `api/catering-facilities/${cateringFacilityId}/categories/${id}`,
      JSON.stringify(data)
    ).then(_ => Emitter.emit(CATEGORIES_LIST_UPDATED, {}));
  }

  static deleteCategory(cateringFacilityId, id) {
    return HttpRequest.Delete(
      `api/catering-facilities/${cateringFacilityId}/categories/${id}`
    ).then(_ => Emitter.emit(CATEGORIES_LIST_UPDATED, {}));
  }
}
