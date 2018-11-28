# Requirements for a Plugin

A plugin should be quite well decoupled from the rest of the application, with a finite and
predefined interface.  The job of this file is to specify that interface.

## Mezzo

The only part of the plugin which should be `require`d from other code is the mezzo, which should be
in a file called `mezzo.js`, or whose name ends with `[mM]ezzo.js`.

The default export of that file should be a class or function which can act as a Mezzo.

A Mezzo's primary raison d'etre is to persist its idiosyncratic state; its lifetime is that of the
ESO that owns it, but where the ESO is a member of a class, the Mezzo is as unique as it wants to
be.  Once it has all that state, it might as well also have complex behaviour.

Typically the exportable Mezzo will just be the tip of the iceberg of a collection of bespoke files
and plugins and classes and functions and so on; the internal architecture of this collection is up
to the author(s) of the plugin.

### Methods

#### constructor

  no known requirements

#### getView() -> View

  returns a React Component that is a View.  c.f. the relevant section below.

#### whatever the View wants

  the Mezzo and its View must coordinate how they coordinate; the details are encapsulated

#### overworldTick(sumT, deltaT, accumT) -> processedT

  This is the standard signature for something that can be subscribed to ticks from a timesource.
In this case, it's for ticks from the timesource for the overworld economy engine, which passes ticks
to the ESOs, which in turn pass ticks to their Mezzos.  It's up to the Mezzo to decide if it cares
about the passage of time, and what to do; usually it will modify internal state and/or make changes
to the ESO's state.

  QUESTION: should we return the amount of time we PROCESSED, or should we return the LEFTOVERS (the
scraps)?  Sigh.

  

## MezzoView

The MezzoView is really just another React Component.  It will be rendered by the TheModal when
interactions with the overworld cause that to happen.

We haven't worked out details exactly yet, but it obviously needs to have a handle on the Mezzo in
question.  Maybe that's passed as a prop which the Mezzo pre-binds (perhaps in the way a HoC would
do it, c.f. the React docs).  Maybe the entire View class is declared inside the Mezzo, and
therefore it can access the Mezzo via lexical closure.  Maybe something else.  Technically it can be
different for different Mezzo/MezzoView pairs, but we probably want to do something pretty standard.


### Rendering Paradigms

#### All React

Maybe a MezzoView is made entirely of React components.  In this case, we clearly want state-flow
between the Mezzo and the MezzoView to work in a React-consistent way.  There's something I don't
understand about how to get this to work, because how does a parent correctly update a child's
props, and how can the Mezzo hijack this process?

However, GSB pointed out a clearly-usable bad alternative, as follows.  One of the props the View
gets is a RegisterMe callback.  On construction, it calls this callback with a pointer to itself.
This callback is a method of the Mezzo, and now the Mezzo has a handle to the instance of the View
(in case there was no better way to get this).  Now the Mezzo can call any methods that the View
has, including `setState` or bespoke state-overriding methods.


#### All Canvas or Phaser or Whatever

Jeremy built a nice simple prototype of wrapping a canvas element in a React element.  Use refs to
get ahold of the canvas element in `componentDidMount`, where you can get the graphics context,
register event listeners, start a `requestAnimationFrame` recursion, and so on.  Don't forget to add
a `componentWillUnmount`, in which you'll unregister the listeners, terminate the `rAF` recursion,
and whatever else.  Furthermore, you want to wire all that up to your model/controller, which are
probably another class, which you can either instantiate in the constructor, or receive as a prop.
Presumably that controller has a method for accepting that wiring.

Phaser shouldn't really be any harder than canvas.  Or at least not much.


#### Mixed

Of course, we actually want to be able to have MezzoGames be React, but trigger non-react Minigames.
This should also be possible, but it's sort of a worst-of-both-worlds situation in terms of
implementation.









