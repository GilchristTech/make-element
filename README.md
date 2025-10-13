# `makeElement()` — Tiny DOM tree creation

This module exports one function: `makeElement()`, which
creates DOM Element trees from nested JavaScript objects. It's
meant to pair nicely with browser APIs and get element-generating
code off the ground quickly.

## Function Reference

`makeElement(input: string | object | HTMLElement | Array | ...args)`

Creates one or more DOM elements from the given input, based on
its data type:

- HTMLElement — returned as-is.

- String — parsed shorthand for a single element (eg: `"div#id.class | Text"`).

- Object — full element definition (supports tag, child, children, attributes, style, etc.).

- Array — multiple definitions, each processed recursively.

- Multiple arguments — treated like an array, combined into one wrapper `<div>`.

Returns either a single HTMLElement or an array of HTMLElements,
depending on how it is called.

### HTMLElement

When `makeElement` encounters an existing `HTMLElement`, it adds it to the
tree, as-is. This allows you to mix elements created with
`makeElement` and those from browser DOM APIs:

```javascript
const button = document.createElement("button");
button.textContent = "Click me";

const wrapper = makeElement({
  tag: "div.wrapper",
  child: button,
});
```

### Array or multiple arguments

When `makeElement` is called with either an array or
multiple arguments, it returns an array of multiple elements. If
any of those items are arrays, they're wrapped by a `<div>`.

```javascript
makeElement([
  "h1 | Hello World",
  { tag: "p", text: "This is a paragraph" },
  ["span|Inline 1", "span|Inline 2"],  // these spans will be in a <div>
]);
```

### Element string

When encountering a string, it is parsed with a simple format to
create one element. This format is similar to CSS selectors, but
does not assign meaning to whitespace.

| Syntax       | Description          | Example           |
| ------------ | -------------------- | ----------------- |
| Staring word | Tag name             | `div`             |
| `.`          | Define a class       | `div.classname`   |
| `#`          | Sets the ID          | `section#id-name` |
| <code>&#124;</code> | Defines text content | <code>h1 &#124; My Heading</code> |

#### Whitespace Handling

Unlike CSS selectors, element strings are not
whitespace-sensitive; classes and IDs can have spaces between
them for readability (eg: `h1 #main-heading .big .underline | My Page`).

*note:* The text of the element (denoted by a `|`), also gets
trimmed. To preserve whitespace, use an object with a `text`
property.

### Object

When `makeElement` encounters a generic object, it reads its
properties to construct the element. The properties are
interpreted as follows:

| Property            | Description                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| `tag`               | Element tag string (eg: `"div#id.class"`).                                                        |
| `class` / `classes` | Additional class names (string or array).                                                         |
| `innerHTML`         | Raw HTML string.                                                                                  |
| `text`              | Sets the element's `textContent` property.                                                        |
| `style`             | Object of CSS property/value pairs.                                                               |
| `child`             | Single nested element (recursively processed).                                                    |
| `children`          | Array of nested elements (recursively processed).                                                 |
| `onClick`           | Sets the element's onclick handler.                                                               |
| `onChange`          | Sets the element's onchange handler.                                                              |
| `events`            | Object of event handlers. Keys are the name of the event, and values are event handler function (`element.addEventListener(key, value)`). Handlers are either functions or `null`, in which case they are skipped. |
| `attributes`        | Object of attribute values.                                                                       |
| `data`              | Object of <code>data-&ast;</code> attributes (`{ userId: 123 }` → `element.dataset["data-user-id"] = "123"`). |
| `apply`             | After the element is created, runs a function with the element as an argument (`apply(element)`). |
| `bind`              | Takes an object of functions, and binds and assigns each function into the Element object.        |
| `from`              | Instead of creating an element, assign properties into an existing element.                       |
| `assign`            | Takes an object, and assigns each property into the Element object using `Object.assign()`.       |

## A Longer Example

```javascript
makeElement({
  // Append elements and assign styles into the document body
  from: document.body,

  style: {
    color:      "#222",
    lineHeight: "1.4",
    margin:     "0",
    fontFamily: "sans-serif",
  },

  child: {
    tag: "main",
    style: {
      maxWidth: "800px",
      margin:   "2em auto",
    },

    children: [
      { tag: "h1 .title | Make Element Example",
        style: {
          borderBottom: "6px double #ccc",
        },
      },

      { tag: "div.card",

        style: {
          padding:       "1em",
          boxShadow:     "2px 10px 24px #0002",
          border:        "1px solid #888",
          display:       "flex",
          flexDirection: "column",
          maxWidth:      "250px",
        },

        children: [
          { tag: "h2 | Card Title",
            style: { margin: "0" },
          },

          { tag: "p",
            text: "Paragraph with text",
            style: {
              fontStyle: "italic",
              margin:    "0.5em 0",
            },
          },

          { tag: "button | Close",
            onClick: function () {
              this.parentElement.remove();
            },
          },
        ],
      },
    ],
  },
});
```

## License

MIT
