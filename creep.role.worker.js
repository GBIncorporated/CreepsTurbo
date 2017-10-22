let mod = {};
module.exports = mod;
mod.name = 'worker';

mod.run = function (creep)
{

   let target;
   let activity = creep.GetActivity();
   // Set new activity
   if (activity == null || activity == undefined || activity.name == 'idle' || !activity.isValidActivity(creep)) {
      activity = this.nextActivity(creep);
      if (activity == null) {
         // console.log("Null activity");
      }
      creep.SetActivity(activity);
   }

   if (activity == null || activity == undefined) {
      // fail fast cause we have no activity do the idle activity that has no target and never get null activity
      return;
   }
   // activity set now check target to see if we need a new one
   target = this.nextTarget(creep, activity);
   if (target != null) {
      creep.SetTarget(target);
   }

   if (activity && target) {
      activity.step(creep);
   } else {
      console.log('Creep without Activity/activity!\nCreep: ' + creep.name + '\ndata: ' + JSON.stringify(creep.data));
   }
};

// These can be base class maybe next acitivty might not be
mod.nextTarget = function (creep, activity)
{
   // get the original target and see if its still valid
   let target = creep.GetTarget();
   if (target === null || target === undefined || !activity.isValidTarget(target)) {
      target = activity.newTarget(creep);
   }
   return target;
}

mod.nextActivity = function (creep)
{
   let role = creep.GetRole();
   for (var iActivity = 0; iActivity < role.activityQueue.length; iActivity++) {
      var activity = Creep.activity[role.activityQueue[iActivity].name];
      const validActivity = activity.isValidActivity(creep);

      if (!validActivity) {
         continue;
      }
      // have a valid activity for this creep check get next target
      return activity;
   }
};
// Spawn Setup 
mod.activityQueue = [Creep.activity.harvest, Creep.activity.deposit, Creep.activity.build, Creep.activity.idle];

mod.setup = {};
// define the default spawn values of worker
mod.setup.default = {
   fixedBody: [],
   multiBody: [CARRY, CARRY, MOVE, WORK],
   maxMulti: room => { return 6 },
   maxCount: room => { return 4 },
};

// define the high spawn values of worker
mod.setup.low = {
   fixedBody: [],
   multiBody: [CARRY, CARRY, MOVE, WORK],
   maxMulti: room => { return 1 },
   maxCount: room => { return 3 },
};

// define the high spawn values of worker
mod.setup.high = {
   fixedBody: [],
   multiBody: [CARRY, CARRY, MOVE, WORK],
   maxMulti: room => { return 10 },
   maxCount: room => { return 4 },
};

// Defines what setup to use for what controller level
mod.spawnSetup = function (room)
{
   let roomLevel = room.controller.level;
   // Controller levels of what type to spawn
   if (roomLevel == 1) return this.setup.low;
   if (roomLevel == 2) return this.setup.low;
   if (roomLevel == 3) return this.setup.default;
   if (roomLevel == 4) return this.setup.default;
   if (roomLevel == 5) return this.setup.default;
   if (roomLevel == 6) return this.setup.default;
   if (roomLevel == 7) return this.setup.default;
   if (roomLevel == 8) return this.setup.high;
};

mod.parts = function (room)
{
   var parts = [];

   let controllerLevel = room.controller.level;

   let setup = mod.spawnSetup(room);
   let fixedBody = setup.fixedBody;
   let multiBody = setup.multiBody;
   let maxMulti = setup.maxMulti(room);
   let maxCount = setup.maxCount(room);

   let costOfSingleMulti = 0;
   for (let part of multiBody) {
      costOfSingleMulti += BODYPART_COSTS[part];
   }

   let multiNumber = Math.round(room.energyAvailable / costOfSingleMulti);
   if (multiNumber > maxMulti) {
      multiNumber = maxMulti;
   }
   for (let j = 0; j < multiBody.length; j++) {
      for (let i = 0; i < multiNumber; i++) {
         parts.push(multiBody[j]);
      }
   }
   return parts;
};
