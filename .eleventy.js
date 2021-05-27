const { DateTime } = require("luxon");
const fs = require("fs");

const pluginNavigation = require("@11ty/eleventy-navigation");

const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");


/**
 * FUNCS
 */
const currentMonth = () => {
   return new Date().toLocaleString('default', {month: 'long'}).toLowerCase()
}
const monthString = (monthNumber, type) => {
  return new Date(2020, monthNumber, 1).toLocaleString('default', {month: type})
}
const resolveTag = (tag) => {
  return tag.replace(":current_month:", currentMonth())
}
const filterByTag = (items, tag) => {
  return items.filter(i => i.tags.includes(tag) )
}
const iUrl = (item) => {
  return item.attributes.uris.url
}
const iTitle = (item) => {
  return item.attributes.titles.safe
}
const iTypeTitle = (item) => {
  return item.attributes.type.title
}
const iTypeSlug = (item) => {
  return item.attributes.type.slug
}
const iTags = (item) => {
  return item.tags.join(" ")
}
const iThumb = (item) => {
  return "/assets/images/" + item.attributes.images.thumb.local
}
const iImage = (item) => {
  return "/assets/images/" + item.attributes.images.main.local
}
const iCaptured = (item) => {
  return item.attributes.phrases.capture.safe
}
const iMuseum = (item) => {
  return item.attributes.phrases.museum.safe
}

const is = (item, status, month, hemisphere, type) => {
  if(typeof month == "undefined")  month = currentMonth()
  tag = `${status}`
  if(month) tag = `${tag}_${month}`
  if(hemisphere) tag = `${tag}_${hemisphere}`
  if(type) tag = `type_${type.replace("-", "")}_${tag}`

  return (item.tags.includes(tag)) ? "1" : "0"
}

module.exports = function(eleventyConfig) {
  

  // Add plugins
  eleventyConfig.addPlugin(pluginNavigation);

  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.setDataDeepMerge(true);
  
  eleventyConfig.addFilter("currentMonth", currentMonth)
  eleventyConfig.addFilter("monthString", monthString)
  eleventyConfig.addFilter("is", is);
  eleventyConfig.addFilter("filterByTag", filterByTag)
  eleventyConfig.addFilter("resolveTag", resolveTag)
  eleventyConfig.addFilter("iUrl", iUrl)
  eleventyConfig.addFilter("iTitle", iTitle)
  eleventyConfig.addFilter("iTypeTitle", iTypeTitle)
  eleventyConfig.addFilter("iTypeSlug", iTypeSlug)
  eleventyConfig.addFilter("iTags", iTags)
  eleventyConfig.addFilter("iThumb", iThumb)
  eleventyConfig.addFilter("iImage", iImage)
  eleventyConfig.addFilter("iMuseum", iMuseum)
  eleventyConfig.addFilter("iCaptured", iCaptured)

  // Customize Markdown library and settings:
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: [
      "md",
      "njk",
      "liquid"
    ],

    pathPrefix: "/",
    // -----------------------------------------------------------------

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // Opt-out of pre-processing global data JSON files: (default: `liquid`)
    dataTemplateEngine: false,

    // These are all optional (defaults are shown):
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
