import HttpRequest from "./http-request";
import Emitter from "./event-emitter";
import { CATEGORIES_LIST_UPDATED } from "./categories-service";

export const DISHES_LIST_UPDATED = "DISHES_LIST_UPDATED";

export default class DishesService {
  static createDish(name, description, price, categoryId) {
    const data = {
      dishName: name,
      description: description,
      price: price,
      cateringFacilityCategoryId: categoryId
    };
    return HttpRequest.Post(`api/dishes`, JSON.stringify(data)).then(_ => {
      Emitter.emit(DISHES_LIST_UPDATED, {});
      Emitter.emit(CATEGORIES_LIST_UPDATED, {});
    });
  }

  static updateDish(id, name, description, price, categoryId) {
    const data = {
      dishName: name,
      description: description,
      price: price,
      cateringFacilityCategoryId: categoryId
    };
    return HttpRequest.Put(`api/dishes/${id}`, JSON.stringify(data)).then(_ => {
      Emitter.emit(DISHES_LIST_UPDATED, {});
      Emitter.emit(CATEGORIES_LIST_UPDATED, {});
    });
  }

  static getDishes(cateringFacilityId) {
    return HttpRequest.Get(
      `api/dishes?cateringFacilityId=${cateringFacilityId}`
    );
  }

  static getDish(id) {
    return HttpRequest.Get(`api/dishes/${id}`);
  }

  static changeStatus(id, status) {
    const data = {
      dishStatus: status
    };
    return HttpRequest.Put(`api/dishes/${id}/status`, data).then(_ =>
      Emitter.emit(DISHES_LIST_UPDATED, {})
    );
  }

  static updateIcon(id, url) {
    const data = {
      url: url
    };

    return HttpRequest.Put(`api/dishes/${id}/icon`, data).then(_ =>
      Emitter.emit(DISHES_LIST_UPDATED, {})
    );
  }
}
