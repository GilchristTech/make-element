export function makeElement (obj={}) {
  if (arguments.length === 0) {
    throw new TypeError("makeElement() expects at least one element, but was called with none");
  } else if (arguments.length > 1) {
    return makeElement(Array.from(arguments));
  }

  if (!obj) {
    throw new TypeError("Element definition is falsey");

  } else if (obj instanceof HTMLElement) {
    return obj;

  } else if (typeof obj === "string" ) {
    return makeElement({ tag: obj });

  } else if (Array.isArray(obj)) {
    const elements = [];
    for (let element_definition of obj) {
      if (element_definition instanceof HTMLElement) {
        elements.push(element_definition);

      } else if (Array.isArray(element_definition)) {
        const wrapper  = document.createElement("div");
        const children = makeElement(element_definition);

        for (let child of children) {
          wrapper.appendChild(child);
        }

      } else if (element_definition === null) {
        // no-op

      } else {
        elements.push(makeElement(element_definition));
      }
    }

    return elements;
  }

  // The tag attribute of the object can also contain CSS-style
  // classes and IDs. Parse them.
  let element_tag_src = obj.tag ?? "div";

  const element_tag_pipe_index = element_tag_src.indexOf("|");

  let text = null;

  if (element_tag_pipe_index >= 0) {
    text = element_tag_src.slice(element_tag_pipe_index+1).trim();
    element_tag_src = element_tag_src.slice(0, element_tag_pipe_index);
  }

  const element_tag_items = element_tag_src.match(/((?:[.#]|^)[^.#]*)/g);

  let tag = "div";
  let id  = null;
  const classes = [];

  for (let element_attribute of element_tag_items) {
    if (element_attribute.startsWith(".")) {
      classes.push(element_attribute.slice(1).trim());
    } else if (element_attribute.startsWith("#")) {
      element.id = element_attribute.slice(1).trim();
    } else {
      tag = element_attribute.trim();
    }
  }

  if (obj.class || obj.classes) {
    const classes_src = (" " + (obj.classes || "") + " " + (obj.class || ""));

    for (let class_name of classes_src.split(" ")) {
      class_name = class_name.trim();
      if (!class_name)
        continue;
      classes.push(class_name);
    }
  }
  
  const element = obj.from || document.createElement(tag);

  for (let class_name of classes) {
    element.classList.add(class_name);
  }

  if (obj.id) {
    id = obj.id;
  }

  if (id) {
    element.id = id;
  }

  if (obj.innerHTML) {
    element.innerHTML = obj.innerHTML;

  } else if (text || obj.text) {
    element.textContent = obj.text || text;
  }

  if (obj.style) {
    for (let [property, value] of Object.entries(obj.style)) {
      element.style[property] = value;
    }
  }

  if (obj.child || obj.children) {
    let children_definitions = obj.children || obj.child;

    let children = makeElement(children_definitions);
    if (! Array.isArray(children)) {
      children = [children];
    }

    for (let child of children) {
      element.appendChild(child);
    }
  }

  if (obj.onClick) {
    element.addEventListener("click", obj.onClick);
  }

  if (obj.attributes) {
    for (let [key, value] of Object.entries(obj.attributes)) {
      element.setAttribute(key, value);
    }
  }

  if (obj.data) {
    for (let [key, value] of Object.entries(obj.data)) {
      element.dataset[key] = value;
    }
  }

  if (obj.assign) {
    Object.assign(element, obj.assign);
  }

  if (obj.bind) {
    for (let [key, func] of Object.entries(obj.bind)) {
      if (typeof func != "function")
        throw new TypeError("Value in bind is not a function");
      element[key] = func.bind(element);
    }
  }

  if (obj.apply) {
    obj.apply(element);
  }

  return element;
}


export default makeElement;
