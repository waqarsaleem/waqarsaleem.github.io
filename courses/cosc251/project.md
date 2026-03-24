---
layout: no-header
title: COSC 251 Spring 2026: Final Project
---

# COSC 251: Final Project — Language in the Wild

---

## 1. Overview

In this course, we have examined programming languages analytically. We have asked not just what a language does, but why it makes the design choices it does and what those choices cost. We have done this for ML, Java, and Prolog. This project asks you to do the same for a language of your choice.

You will work with your buddy to select a language from the approved list, analyze it using the conceptual framework developed in this course, build a small program that meaningfully demonstrates its distinctive features, and present your findings in person. The goal is not a survey. The goal is an argument — a defensible claim about what makes your chosen language what it is.

---

## 2. Language Selection

Select one language from the list below. Selections are first-come, first-served. No two teams may present the same language. Inform me of your choice in class. Your top choice may already be taken so have at least 2 backups.

**Approved Languages**

C · Clojure · Elixir · Erlang · Go · Haskell · Lua · OCaml · Racket · Ruby · Rust · Scala · Scheme · TypeScript · Zig

Each language on this list is well-documented, embodies interesting paradigms, and is genuinely distinct from the three languages covered in the course. Some will feel familiar; others will require real exploration. In either case, the analytical depth expected is the same.

---

## 3. Analysis

The course has developed a set of parameters for analyzing programming languages. Your project must engage with these parameters, organized into the seven clusters below.

### Required Cluster

Every team must address all four items in Cluster 1. These anchor your analysis and require relatively little effort to establish.

**Cluster 1 — Language Identity and System**  
History · Language system · Compile vs. interpret · Dynamic vs. static loading

### Elective Clusters

From the six clusters below, your team must engage with at least four. Within each chosen cluster, address at least two of the listed items. For each cluster you do not cover, include a brief written justification in your language profile explaining why those parameters are less central to your chosen language.

Note: absence is as analytically interesting as presence. If your language lacks pattern matching or has no object-orientation model, saying so — and explaining what it does instead — is a valid and often revealing form of analysis.

**Cluster 2 — Syntax and Meaning**  
Syntax and grammar · Control structures · Precedence and associativity · Semantics

**Cluster 3 — Type System**  
Primitive types and operations · Types and type system (static/dynamic, strong/weak, type checking) · Generic programming

**Cluster 4 — Functional Character**  
Higher-order functions · Pattern matching · Pure vs. side-effect operations · Cost model

**Cluster 5 — Object-Oriented Character**  
Object orientation · Interfaces · Inheritance

**Cluster 6 — Runtime Behavior**  
Scope, visibility, and binding rules (nested scopes, name hiding, namespaces, static/compile-time/runtime binding) · Memory locations · Activation records · Memory management (stack and heap, garbage collection)

**Cluster 7 — Polymorphism and Programmer Interface**  
Polymorphism · Parameters and parameter passing (by value, by reference, by copy, by name) · Error handling (in-band, out-of-band, option values, exceptions)

### Coverage Requirements

1. Cluster 1 is required in full for every team.
1. From Clusters 2–7, you must cover at least four clusters, engaging with at least two items per chosen cluster.
1. For each skipped cluster, provide a brief written justification in the language profile explaining why those parameters are less central to your chosen language.
1. Absence of a feature in a language is just as valid as the presence of another. If a feature is absent from your language, explain what the language does instead and what that design choice says about the language.

### Analysis vs. Description

The most important distinction in this project is between describing a language and analyzing it. Description says what is there. Analysis says what it means, why it matters, and how it connects to other design choices.

**Example: Type System**

❌ Weak: "Haskell has a strong static type system with type inference." This is a description.

✅ Strong: "Haskell's type system does at compile time what Java's checked exceptions attempt at runtime — it forces the programmer to account for every possible failure path." This is an analytical claim — it makes a claim and compares with course material.

---

## 4. Programming Component

Your team will design and implement a small program in your chosen language. The program is not graded on size or complexity. It is graded on how well it demonstrates features of the language that are central to your analysis.

Choosing the right task is part of the assignment. A program that could have been written in any language, in the same way, demonstrates nothing. The ideal tasks are those where the language's design forces you to think differently.

### Requirements

1. A clearly identified task with a written argument for why it exercises the language's distinctive features.
1. A working implementation with meaningful inline annotations connecting code choices to your analytical framework.
1. At least two of the features you analyzed must be visibly implemented in the code.
1. The code must be correct and runnable. Instructions for running it must be included as inline comments, an accompanying file, or the repository README.
1. A live demonstration and defense during your presentation.

**Example: Choosing a Task for Erlang**

❌ Poor choice: "We implemented a binary search tree in Erlang." A BST can be written in almost any language. It reveals nothing specific about Erlang.

✅ Better choice: "We implemented a counter that multiple processes can increment independently, without sharing any variables. This task requires Erlang's process model and message passing. It cannot be implemented the same way in Java or Python."

---

## 5. Checkpoint

Before your final submission, each team will submit a one-page proposal. The purpose is to catch misunderstandings early, not to evaluate the quality of your final work.

Teams may not proceed to final submission without checkpoint clearance.

Your proposal must include:

1. Your chosen language.
1. The four analytical clusters you plan to cover from Clusters 2–7, in addition to Cluster 1.
1. A one-paragraph description of your proposed programming task and why it is a good fit.
1. Any questions or concerns about the project.

Proposals will receive brief feedback. If your task choice or cluster selection needs adjustment, you will be told before you invest significant work.

A proposal that says "we plan to analyze Rust's type system and memory model, and implement a program that demonstrates ownership" is doing exactly what this checkpoint is for. A proposal that says "we will analyze Rust generally" is not — it will be sent back for revision.

---

## 6. Deliverables and Submission

All materials are submitted together on Blackboard by the deadline, except the checkpoint for which we will meet earlier.

### 6.1 One-Page Language Profile

Each team submits a one-page structured language profile — not an essay, but a concise, structured document with the following required fields. The one-page requirement enforces precision and prioritization.

1. **Header**: Language name, paradigm classification, year created, primary use domain.
1. **Parameter selection**: Your chosen clusters and items, with 1–2 sentence justification for each, and brief justification for any skipped clusters.
1. **Key claims**: 2–3 bullet-point claims your team is arguing about the language — not descriptions, but assertions.
1. **Task rationale**: One short paragraph: the programming task and why it demonstrates the language's distinctive features.
1. **Surprises**: 1–2 observations about where the language behaved unexpectedly relative to the course framework.

**Key claims: what they look like**

❌ Weak claim: "Rust has an interesting ownership model." This is a description, not a claim.

✅ Strong claim: "Rust's ownership model is a compile-time solution to runtime memory management — it eliminates the need for a garbage collector by making memory lifetime part of the type system."

### 6.2 Presentation

Presentations will be held in person in my office and will run 20–25 minutes. Both team members are expected to participate meaningfully. The presentation is not a reading of the language profile — it is a chance to make your argument clearly and defend it.

- **Central argument**: Open with the claim(s) your team is making about the language. What is the one thing you want me to understand about it?
- **Parameter walkthrough**: Walk through your chosen analytical parameters. Connect each to course concepts where possible. Do not simply list features.
- **Code demonstration**: Run your program. Walk through the key sections. Explain why the code looks the way it does — what the language forced, allowed, or prevented.
- **Defense**: Be prepared to answer questions about your analysis, your code, and your parameter selection choices.

A presentation that opens with "what is Haskell" and walks through features one by one is a survey, not an argument. A presentation that opens with a claim and uses each parameter to argue for that claim is more in line with this project's requirements.

### 6.3 Individual Reflection

Each team member submits a personal reflection of approximately one page. This is an individual document — not a team document - so make sure to identify yourself in it. Your reflection is graded on your insights, not on length. It must address all three of the following:

1. **Contribution.** What did you personally work on? Be specific about which parts of the analysis, the code, and the presentation you led versus collaborated on.
1. **Language insight.** What is the one thing you now understand about programming languages that you did not before this project? Connect it explicitly to something from the course — a chapter, a concept, a moment in lecture. "I learned a lot about Rust" is not an acceptable answer. A better one is, "I didn't understand why the nesting link in Chapter 12 is required until I saw that Go sidesteps it entirely by disallowing nested functions."
1. **Reflection.** What would you do differently with more time — in the analysis, the code, or the task selection? Connect with issues or insights you encountered during the project.

### 6.4 Code Submission

Submit a link to a publicly accessible and reasonably documented GitHub repository (preferred), or code files as a ZIP archive.

### 6.5 Submission Checklist

1. Checkpoint proposal (submitted separately and early).
1. One-page language profile.
1. Annotated, correct, and runnable source code (GitHub link or ZIP).
1. Individual reflection — one per team member, submitted individually, with name on document.
1. Presentation slides (if used) — link to online slides (preferred) or the presentation file.
