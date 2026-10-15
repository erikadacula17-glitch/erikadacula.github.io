"use strict";

document.addEventListener("DOMContentLoaded", function () {
    loadPortfolio();
    setupContactForm();
    setupBackToTop();
    setupScrollAnimations();
    setupSparkles();
});

async function loadPortfolio() {
    const projectsMessage = document.getElementById("projectsMessage");
    
    try {
        const response = await fetch("data/projects.json");
        if (!response.ok) throw new Error("JSON not found");
        
        const data = await response.json();
        
        setTextContent("studentName", data.name);
        setTextContent("tagline", data.tagline);
        setTextContent("introduction", data.introduction);
        setAttribute("profileImage", "src", data.profileImage);
        setTextContent("biography", data.about.biography);
        setTextContent("education", data.about.program + " — " + data.about.school);
        setTextContent("graduation", data.about.graduation);
        setTextContent("careerGoal", data.about.careerGoal);
        setTextContent("interests", data.about.interests);
        setTextContent("contactEmail", data.contact.email);
        setAttribute("contactEmail", "href", "mailto:" + data.contact.email);
        setTextContent("contactLocation", "Location: " + data.contact.location);
        setAttribute("linkedinLink", "href", data.contact.linkedin);
        setTextContent("footerText", "\u00A9 " + new Date().getFullYear() + " " + data.name + ". All rights reserved.");
        
        displaySkills(data.skills);
        displayProjects(data.projects);
        loadGitHubRepositories(data.githubUsername);
        
    } catch (error) {
        console.log("📄 Using static content:", error.message);
        if (projectsMessage) projectsMessage.textContent = "";
    }
}

function setTextContent(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function setAttribute(id, attr, value) {
    const el = document.getElementById(id);
    if (el) el[attr] = value;
}

function displaySkills(skills) {
    const container = document.getElementById("skillsContainer");
    if (!container || !Array.isArray(skills)) return;
    container.innerHTML = "";
    skills.forEach(skill => {
        const card = document.createElement("div");
        card.className = "skill-card";
        card.textContent = skill;
        container.appendChild(card);
    });
}

function displayProjects(projects) {
    const container = document.getElementById("projectsContainer");
    const message = document.getElementById("projectsMessage");
    if (!container) return;
    
    if (!Array.isArray(projects) || projects.length === 0) {
        if (message) message.textContent = "";
        return;
    }
    
    container.innerHTML = "";
    if (message) message.textContent = "";
    
    projects.forEach(project => {
        const card = document.createElement("article");
        card.className = "project-card";
        
        const content = document.createElement("div");
        content.className = "project-content";
        
        const title = document.createElement("h3");
        title.textContent = project.title;
        
        const description = document.createElement("p");
        description.textContent = project.description;
        
        const tech = document.createElement("span");
        tech.className = "project-tags";
        tech.textContent = project.technologies;
        
        content.append(title, description, tech);
        card.appendChild(content);
        container.appendChild(card);
    });
}

async function loadGitHubRepositories(username) {
    const container = document.getElementById("githubRepos");
    const message = document.getElementById("githubMessage");
    const profileLink = document.getElementById("githubProfile");
    
    if (!container) return;
    
    if (!username || username === "yourusername") {
        if (message) message.textContent = "📌 Update your GitHub username in projects.json to see your repos!";
        return;
    }
    
    if (profileLink) profileLink.href = "https://github.com/" + encodeURIComponent(username);
    
    try {
        const apiURL = "https://api.github.com/users/" + encodeURIComponent(username) + "/repos?sort=updated&per_page=5&type=public";
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error("GitHub API failed");
        
        const repositories = await response.json();
        container.innerHTML = "";
        
        if (repositories.length === 0) {
            if (message) message.textContent = "No public repositories yet.";
            return;
        }
        
        if (message) message.textContent = "";
        repositories.forEach(repo => {
            const item = document.createElement("li");
            const link = document.createElement("a");
            link.href = repo.html_url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = repo.name;
            
            const language = document.createElement("p");
            language.className = "repository-language";
            language.textContent = "Language: " + (repo.language || "Not specified");
            
            item.append(link, language);
            container.appendChild(item);
        });
        
    } catch (error) {
        console.log("GitHub API error:", error.message);
        if (message) message.textContent = "";
    }
}

function setupContactForm() {
    const form = document.getElementById("contactForm");
    const feedback = document.getElementById("formFeedback");
    if (!form || !feedback) return;
    
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        if (!form.checkValidity()) {
            feedback.textContent = "⚠️ Please fill in all fields correctly.";
            return;
        }
        
        const visitorName = document.getElementById("visitorName").value.trim();
        const visitorEmail = document.getElementById("visitorEmail").value.trim();
        const visitorMessage = document.getElementById("visitorMessage").value.trim();
        
        if (visitorName.length < 2 || visitorMessage.length < 10) {
            feedback.textContent = "⚠️ Name must be at least 2 characters, message at least 10.";
            return;
        }
        
        feedback.textContent = "✅ Message sent successfully!";
        form.reset();
        
        setTimeout(() => {
            feedback.textContent = "";
        }, 5000);
    });
}

function setupBackToTop() {
    const button = document.getElementById("backToTop");
    if (!button) return;
    
    window.addEventListener("scroll", function () {
        button.classList.toggle("visible", window.scrollY > 300);
    });
    
    button.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function setupSparkles() {
    function createSparkles(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 10; i++) {
            const spark = document.createElement('div');
            spark.classList.add('electric-spark');
            
            const angle = (i / 10) * Math.PI * 2;
            const distance = 20 + Math.random() * 20;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            spark.style.left = centerX + 'px';
            spark.style.top = centerY + 'px';
            spark.style.transform = `translate(-50%, -50%) translate(${endX}px, ${endY}px)`;
            spark.style.animation = `sparkFade 0.5s ease-out forwards`;
            
            document.body.appendChild(spark);
            setTimeout(() => spark.remove(), 500);
        }
    }
    
    document.querySelectorAll('.btn, .nav-btn, .back-to-top').forEach(btn => {
        btn.addEventListener('click', createSparkles);
        btn.addEventListener('touchstart', createSparkles);
    });
}
