// check if a path is valid
global.validatePath = path =>
{
      let mod;
      try {
            mod = require(path);
      }
      catch (e) {
            if (global.DEBUG !== false && !(e.message && e.message.startsWith('Unknown module'))) {
                  console.log('<font style="color:FireBrick">Error loading ' + path
                        + ' caused by ' + (e.stack || e.toString()) + '</font>');
            }
            mod = null;
      }
      return mod != null;
};
// evaluate existing module overrides and store them to memory. 
// return current module path to use for require
global.getPath = (modName, reevaluate = false) =>
{
      if (reevaluate || !Memory.modules[modName]) {
            // find base file
            let path = './custom.' + modName;
            if (!validatePath(path)) {
                  path = './internal.' + modName;
                  if (!validatePath(path))
                        path = './' + modName;
            }
            Memory.modules[modName] = path;
            // find viral file
            path = './internalViral.' + modName;
            if (validatePath(path))
                  Memory.modules.internalViral[modName] = true;
            else if (Memory.modules.internalViral[modName])
                  delete Memory.modules.internalViral[modName];
            path = './viral.' + modName;
            if (validatePath(path))
                  Memory.modules.viral[modName] = true;
            else if (Memory.modules.viral[modName])
                  delete Memory.modules.viral[modName];
      }
      return Memory.modules[modName];
};

global.load = (modName) => 
{
      // read stored module path
      let path = getPath(modName);
      // try to load module
      let mod = tryRequire(path, true);
      return mod;
}

// inject members of alien class into base class. specify a namespace to call originals from baseObject.baseOf[namespace]['<functionName>'] later
global.inject = (base, alien, namespace) =>
{
      let keys = _.keys(alien);
      for (const key of keys) {
            if (typeof alien[key] === "function") {
                  if (namespace) {
                        let original = base[key];
                        if (!base.baseOf) base.baseOf = {};
                        if (!base.baseOf[namespace]) base.baseOf[namespace] = {};
                        if (!base.baseOf[namespace][key]) base.baseOf[namespace][key] = original;
                  }
                  base[key] = alien[key].bind(base);
            } else {
                  base[key] = alien[key]
            }
      }
};

// partially override a module using a registered viral file
global.infect = (mod, namespace, modName) =>
{
      if (Memory.modules[namespace][modName]) {
            // get module from stored viral override path
            let viralOverride = tryRequire(`./${namespace}.${modName}`);
            // override
            if (viralOverride) {
                  global.inject(mod, viralOverride, namespace);
            }
            // cleanup
            else delete Memory.modules[namespace][modName];
      }
      return mod;
};

// try to require a module. Log errors.
global.tryRequire = (path, silent = false) =>
{
      let mod;
      try {
            mod = require(path);
      } catch (e) {
            if (e.message && e.message.indexOf('Unknown module') > -1) {
                  if (!silent) console.log(`Module "${path}" not found!`);
            } else if (mod == null) {
                  console.log(`Error loading module "${path}"!<br/>${e.stack || e.toString()}`);
            }
            mod = null;
      }
      return mod;
};

// load code
global.install = () =>
{
      // ensure required memory namespaces
      if (Memory.modules === undefined) {
            Memory.modules = {
                  viral: {},
                  internalViral: {}
            };
      }


      // Load modules
      _.assign(global, load("parameter"));
      _.assign(global, load("constants"));
      Creep.Activity = load("creep.activity");
      _.assign(Creep, {
            activity: {
                  harvest: load("creep.activity.harvest"),
                  deposit: load("creep.activity.deposit"),
                  build: load("creep.activity.build"),
                  upgrade: load("creep.activity.upgrade"),
                  idle: load("creep.activity.idle")
            }
      });
      _.assign(Creep, {
            role: {
                  worker: load("creep.role.worker"),
                  upgrader: load("creep.role.upgrader")
            }
      });

      global.inject(Creep, load("creep"));
      global.inject(Room, load("room"));
      global.inject(Spawn, load("spawn"));
      global.inject(Source, load("source"));

      Creep.extend();
      Room.extend();
      Spawn.extend();
      Source.extend();
}

global.install();
module.exports.loop = function () 
{
      // ensure required memory namespaces
      if (Memory.modules === undefined) {
            Memory.modules = {
                  viral: {},
                  internalViral: {}
            };
      }

      Creep.execute();
      Spawn.execute();

}