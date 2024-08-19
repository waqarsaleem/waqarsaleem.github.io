# Kaavish with WS

I am interested in Computer Graphics projects which require research and original development beyond gluing libraries together. Some suggestions are listed below. That said, I am happy to supervise motivated students on interesting, rigorous projects, even outside Computer Graphics. If you can convince me that you fit, we can give it a go!

Before we embark on a project, here are my expectations from you. Kaavish is your project. You want (have) to complete it and therefore must do whatever it takes to bring the project to fruition. This includes but is not limited to: finding relevant resources; doing the necessary research; learning the necessary theory; reaching out to relevant people; finding/learning relevant software; finding, generating and/or processing the necessary data; finding/implementing helper tools. I may have some occasional tips but this is your project and you have to take responsibility. It is important to understand that I do not know how to do the project - I am learning about it through you. Finding out how to proceed and developing a macro as well as micro understanding of the project is part of your task. I will at best be a high level manager. I will provide all the support that I can but will not be of much help on a technical level.

[Photorealistic Rendering](#render) | [ML and SDF for 3D shape representation](#ml-sdf) | [Quantization thresholds of triangle meshes](#quantization) | [3D Game Engine](#engine)
---

## <a name="render">Photorealistic Rendering</a> 

_Problem_: This project is to photograph a possibly staged scene, and then recreate it exactly in a render.

_What is involved?_: Photorealistic rendering is an important goal in Computer Graphics. Realism ultimately is an outcome of the degree of accuracy with which light transport in the scene is modeled. Fortunately, relevant techniques are quite well studied and good systems exist, e.g. [this one](https://pbrt.org/). For this project, you will study and collect such techniques, implement them in your own library, and showcase them by recreating your photographed scene. So that we do not waste too much time in technicalities, we can use existing tools like [Shadertoy](https://www.shadertoy.com/) or [Unreal Engine](https://www.unrealengine.com/en-US). Along the way, you will most likely also have to use a 3D modeling tool, e.g. [Maya](https://www.autodesk.com/products/maya/overview) or [Blender](https://www.blender.org/), and many others.

_Prerequisites_: Knowledge of basic rendering techniques like pipeline rendering and ray tracing is required. Also helpful is knowledge about shading techniques. These may have been gained through CS 440 Computer Graphics or otherwise.

[top](#kaavish-with-ws)

## <a name="ml-sdf">Machine Learning and Signed Distance Functions for 3D shape representation</a>

_Problem_: This project is to explore the use of machine learning for signed distance functions for 3D shape representation.

_What is involved?_: Signed distance functions (SDF) for 3D shape representation are an emerging area of research. Recent approaches use machine learning to develop the functions, e.g. Neural Geometric Level of Detail: Real-time Rendering with Implicit 3D Shapes Links to an external site.. You will learn how SDF can represent shapes, how learning can be applied, and propose and develop some reasonable application.

This project is foreseen to be heavy in research, math, and implementation, especially graphics programming.

_Prerequisites_: Some introduction to 3D shape representation and rendering, e.g. as gained in the course CS 440 Computer Graphics, will be helpful. A strong grip on mathematics and programming, as well as comfort reading technical research papers will also be required.

_References_: [Neural Geometric Level of Detail: Real-time Rendering with Implicit 3D Shapes](https://nv-tlabs.github.io/nglod/), Takikawa et al., CVPR 2021.

[top](#kaavish-with-ws)

## <a name="quantization">Quantization thresholds of triangle meshesn</a>

_Problem_: This project is to explore the quantization threshold of triangle meshes beyond which a human viewer can discern visible artifacts.

_What is involved?_: This project combines 3D shape representation with human perception. Digitization leads to loss of information. The resolution of digitization matters. An image with smaller color depth may exhibit blockiness as opposed to one with a larger color depth. This effect is also apparent when YouTube switches to a lower resolution due to connection issues. Music sampled at a higher rate is truer to the original than when it is sampled at a lower rate.

But the human visual system can not notice differences beyond a certain threshold. So how much resolution is necessary to digitize a mesh such that the user can no more notice any artifacts?

This project aims to find what characteristics of the mesh influence that indistinguishability threshold, and perhaps arrive at a formula to compute it from the mesh. The project will entail designing the experiment, programming the interface, conducting the experiment, collection and statistical analysis of the results.

Some initial work from 2017 exists but it only scratches the surface.

_Prerequisites_: Some introduction to 3D shape representation and statistical techniques, e.g. as gained in CS 440 and MATH 310, will be helpful. A strong grip on mathematics and programming, as well as comfort reading technical research papers will also be required.

_References_:

- [A user study on quantisation thresholds of triangle meshes](https://dro.dur.ac.uk/22618/), CGVC 2017
- [Quality perception and discrimination thresholds in quantised triangle meshes](https://dro.dur.ac.uk/34440/), Sixth International Workshop on Pattern Recognition 2021, 

_Discalimer_: The above work has been conducted under the supervision of my MS supervisor at his current institute with his current students and colleagues.

[top](#kaavish-with-ws)

## <a name="engine">3D Game Engine</a>

_Problem_: This project is to implement a 3D game engine.

_What is involved?_: This project involves researching and implementing a 3D game engine. A game engine is a sophisticated software that must handle graphics, sound, physics, and interaction, all while ensuring maximum performance. This project will require you to research all the necessary components, the features of each, decide a scope for yourself, and them implement it. You will also have to implement a game that uses the engine. After some initial research, the game and engine can be developed independently of each other - the game only needs to know the interface of the eventual engine.

This project will involve a lot of research, object oriented programming in C++, and working with low level libraries. It should also be great fun!

_Prerequisites_: Good research skills, comfort with math, and fluency in OOP in C++ will be called into play.

_References_: There is no dearth of resources in print and online. Selecting the right one(s) will be part of your task.

[top](#kaavish-with-ws)

---

If you have made it this far, great! I wish you all the best for your Kaavish. 

alles Gute und viel Glück!
