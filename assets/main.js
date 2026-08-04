// Kafka Notes — module registry.
// `file: null` means the segment exists in the log's plan but hasn't been
// appended (written) yet. As modules ship, give them a `file`.
const MODULES = [
  { n: 1, id: "introduction", title: "Introduction", group: "Foundations", file: "01-introduction.html" },
  { n: 2, id: "architecture", title: "Architecture", group: "Foundations", file: "02-architecture.html" },
  { n: 3, id: "installation", title: "Installation", group: "Foundations", file: "03-installation.html" },
  { n: 4, id: "cli", title: "Kafka CLI", group: "Foundations", file: "04-cli.html" },
  { n: 5, id: "producers", title: "Producers", group: "Core APIs", file: "05-producers.html" },
  { n: 6, id: "consumers", title: "Consumers", group: "Core APIs", file: "06-consumers.html" },
  { n: 7, id: "topics-partitions", title: "Topics & Partitions", group: "Core APIs", file: "07-topics-partitions.html" },
  { n: 8, id: "storage", title: "Storage Internals", group: "Core APIs", file: "08-storage.html" },
  { n: 9, id: "connect", title: "Kafka Connect", group: "Ecosystem", file: "09-connect.html" },
  { n: 10, id: "streams", title: "Kafka Streams", group: "Ecosystem", file: "10-streams.html" },
  { n: 11, id: "schema-registry", title: "Schema Registry", group: "Ecosystem", file: "11-schema-registry.html" },
  { n: 12, id: "security", title: "Security", group: "Operations", file: "12-security.html" },
  { n: 13, id: "monitoring", title: "Monitoring", group: "Operations", file: "13-monitoring.html" },
  { n: 14, id: "performance", title: "Performance Tuning", group: "Operations", file: "14-performance.html" },
  { n: 15, id: "docker", title: "Docker Deployment", group: "Deployment", file: "15-docker.html" },
  { n: 16, id: "kubernetes", title: "Kubernetes (Strimzi)", group: "Deployment", file: "16-kubernetes.html" },
  { n: 17, id: "aws-msk", title: "AWS MSK", group: "Deployment", file: "17-aws-msk.html" },
  { n: 18, id: "spring-boot", title: "Kafka with Spring Boot", group: "Application", file: "18-spring-boot.html" },
  { n: 19, id: "microservices", title: "Kafka in Microservices", group: "Application", file: "19-microservices.html" },
  { n: 20, id: "interview-prep", title: "Interview Preparation", group: "Reference", file: "20-interview-prep.html" },
  { n: 21, id: "projects", title: "Hands-on Projects", group: "Reference", file: "21-projects.html" },
  { n: 22, id: "troubleshooting", title: "Troubleshooting", group: "Reference", file: "22-troubleshooting.html" },
  { n: 23, id: "best-practices", title: "Best Practices", group: "Reference", file: "23-best-practices.html" },
];

function renderRail(currentN) {
  const mount = document.getElementById("rail-mount");
  if (!mount) return;
  const base = location.pathname.includes("/modules/") ? "" : "modules/";
  let groups = [];
  MODULES.forEach(m => { if (!groups.includes(m.group)) groups.push(m.group); });

  let html = "";
  groups.forEach(g => {
    html += `<div class="rail-group-label">${g}</div>`;
    MODULES.filter(m => m.group === g).forEach(m => {
      const offset = String(m.n).padStart(3, "0");
      let cls = "segment";
      let href = "#";
      if (m.n === currentN) cls += " current";
      else if (m.file) cls += " done";
      else cls += " locked";

      if (m.file) href = base + m.file;

      const tag = m.file ? "a" : "div";
      const hrefAttr = m.file ? `href="${href}"` : "";
      html += `<${tag} class="${cls}" ${hrefAttr}>
        <span class="offset">${offset}</span>
        <span class="label">${m.title}</span>
      </${tag}>`;
    });
  });
  mount.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  const n = parseInt(document.body.getAttribute("data-module") || "0", 10);
  renderRail(n);
  // Rail toggle for small screens
  const toggle = document.getElementById('rail-toggle');
  if (toggle) {
    // initialize state from localStorage
    const closed = localStorage.getItem('rail-closed') === '1';
    if (closed) document.body.classList.add('rail-closed');
    toggle.setAttribute('aria-expanded', (!closed).toString());
    toggle.addEventListener('click', () => {
      const isClosed = document.body.classList.toggle('rail-closed');
      localStorage.setItem('rail-closed', isClosed ? '1' : '0');
      toggle.setAttribute('aria-expanded', (!isClosed).toString());
    });
  }
});
