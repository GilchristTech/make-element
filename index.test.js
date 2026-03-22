import { describe, expect, test, it } from "vitest";
import makeElement from "./index.js";

describe("string element arguments", () => {
  it("uses the string to create an element of the tag specified", () => {
    expect(makeElement("section").tagName).toBe("SECTION");
  });

  it("specifies classes with .class-name notation", () => {
    const el = makeElement("spawn .class-1 .class-2");
    expect(el.classList).toContain("class-1");
    expect(el.classList).toContain("class-2");
    expect(el.classList).not.toContain("other-class");
  });

  it("creates <div> elements if a class name is not specified", () => {
    const el = makeElement(".my-class");
    expect(el.tagName).toBe("DIV");
    expect(el.classList).toContain("my-class");
  });

  it("assigns ID attribute with #attribute syntax", () => {
    expect(makeElement("#test").id).toBe("test");
  });

  it("uses trimmed text after a pipe symbol as text content", () => {
    expect(makeElement("| element's text").textContent).toBe("element's text");
  });

  it("supports combining the syntax for tags, classes, the id, and text content", () => {
    const el = makeElement("h1.heading .align-center #page-title | My Test Page");
    expect(el.tagName    ).toBe("H1");
    expect(el.classList  ).toContain("heading");
    expect(el.classList  ).toContain("align-center");
    expect(el.id         ).toBe("page-title");
    expect(el.textContent).toBe("My Test Page");
  });
});
