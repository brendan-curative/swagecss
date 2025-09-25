const pluginGitCommitDate = require("eleventy-plugin-git-commit-date");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src");
    eleventyConfig.addPlugin(pluginGitCommitDate);

    eleventyConfig.addFilter("formatCommitDateTime", function(date) {
      if (!date) return "";
      
      const d = new Date(date);
      // Return ISO format: 2024-01-15 14:30:45
      return d.toISOString().replace('T', ' ').slice(0, 19);
    });

     // Date only (no time)
     eleventyConfig.addFilter("formatCommitDate", function(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toISOString().split('T')[0];
      // Output: 2024-01-15
  });

  // Readable date and time
  eleventyConfig.addFilter("formatCommitReadable", function(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("en-US", { 
          month: "short", 
          day: "numeric", 
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true
      });
      // Output: Jan 15, 2024, 2:30 PM
  });

  // Long format
  eleventyConfig.addFilter("formatCommitLong", function(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("en-US", { 
          weekday: "long",
          year: "numeric", 
          month: "long", 
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true
      });
      // Output: Monday, January 15, 2024 at 2:30 PM
  });

  // 24-hour format
  eleventyConfig.addFilter("formatCommit24Hour", function(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit", 
          day: "2-digit"
      }) + " " + d.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit"
      });
      // Output: 01/15/2024 14:30
  });

  // Relative time (how long ago)
  eleventyConfig.addFilter("formatCommitRelative", function(date) {
      if (!date) return "";
      const d = new Date(date);
      const now = new Date();
      const diffTime = Math.abs(now - d);
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays === 1) return "1 day ago";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
      // Output: 2 hours ago, 3 days ago, etc.
  });

    return {
        dir: {
          output: "docs"
        },
        pathPrefix: "/swagecss/"
      }
};

