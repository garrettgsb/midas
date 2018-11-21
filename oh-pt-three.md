

# This Whole File Is Just Some Notes



Think about three types of things:
 * overarching React app
 * overarching Economy model
 * collection of plugable minigames
    * each of which has some model stuff to it, presumably,
    * also exposes a React Component
      * which might be React all the way down, or might be Canvas or something
    * also maybe exposes some methods to inform integration?

The overarching react app consists of:
  * App
  * Map, and MapIcons
  * Sidebar, and SidebarEntries
  * the TheModal
  * multi-use helper components like TradeHelper and UpgradeHelper
  * a collection of Components, one for each minigame
    * each is designed to be a modal hosted by TheModal
    * the more similar to each other these are, the better, BUT not necessary

The Economy consists of:
  * a singleton, the Economy
    * this acts as a queryable registry of EconomicSimObjects (ESOs)
      * that means it exposes some query methods, each of which is basically a filter
            (and maybe also a map)
    * it also acts as a source to drive the passage of econonomic time
  * a collection of EconomicSimulationObjects (ESOs)
    * all ESOs must implement some common interface
      * and we hope that many of them are actually just instances of a small number of classes?
    * some subtypes:
      * industries
      * markets
      * wagons
      * realtor?  (for acquiring new industries/markets/wagons)
      * pen pal post?
    * in addition to their Economic nature, ESOs need to have knowledge of what their minigame is
      * I think this just means that they know the class of the Minigame, passed as an arg to ctor

A minigame X consists of:
  * first of all note that a minigame is probably a family of multiple sub-minigames
    * active : for when the player is actively harvesting from this industry (or whatever)
    * crisis : periodically some ESOs go "into crisis", and must be fixed
    * strategy : this is a way to configure how profitable passive mode is
    * passive : this isn't really a game, but it's what happens as the economy ticks
    * placeholder : maybe some industries have really simple Tier0 tutorial-level games
  * XMezzo
    * root of all state for X
      * some state might live in some transient subcomponents if appropriate?
      * but state in XGame persists for game lifetime
    * has access to the clock, so it drive ticks of physics of the minigame(s)
    * also knows how to do economics stuff, based on its "passive" functionality
      * I think this is tick-driven by the economy, though, via the X-ESO
    * knows how to render XGameView, when a modal calls its `renderInto(domNode)` method
  * XGameView
    * knows how to render
    * this might be a React component (probably this is the general case)
    * or maybe simply do `innerHTML = '<canvas id="asdf"></canvas>';` and then run some code
  * XModal
    * we're currently trying to make the XModal utterly undifferentiated
      * that is, ideally XModal is the same class as YModal for all X and Y
      * this plan might fail, in which case we'll adapt
      * if it succeeds, then we'll eventually want to merge XModal into TheModal, because why not




List of Industries:
  * Mines
    * resources:
      * normal resource is ore, of base metals
      * special resource is gems
    * subgames:
      * active: some kind of burrow-in-the-dirt
      * strategy: allocate ladders and minecarts and elevators and stuff
      * crisis: fight off invader demon-ants in your mine tunnels
      * passive: relatively steady drip of profit, maybe of variable metals?
  * Faerie Woods
    * resources:
      * can forage in the wild for various plants, sometimes getting seeds
        * what patterns-of-cells give what drops is PCG
      * can cultivate garden plots to grow seeds, but some plants don't work well
        * what patterns-of-cells give what drops is PCG
      * special resource is monster-corpses (manticore tails, ogre teeth, etc)
    * subgames:
      * active: pattern-matching/searching
      * strategy: set up garden plots
      * crisis: monsters infest, including stealing growing plants.  hunt and fight them!
      * passive: cellular automata in the garden plots
  * Apothecary
    * resources:
      * can craft potions, which can be sold for money
      * can craft essences, useful as ingredients in other processes
        * 4 humours, aether, ectoplasm, etc?
      * special resource is elemental gems (like geodes, except also aerodes/aquodes/ignodes)
    * subgames:
      * active
    
