let activity = new Creep.Activity();
module.exports = activity;

activity.name = "idle";
activity.renewTarget = false;
activity.maxPerTarget = 6;
activity.targetRange = 1;

// Esnures this activity is valid.
activity.isValidActivity = function (creep)
{
      return true
};

activity.isValidTarget = function (target)
{
      return true;
};

// picks a new target suitable for this activity 
activity.newTarget = function (creep)
{
      // Idle has no target.
      return target;
};

// order for the creep to execute each tick, when assigned to that action
activity.step = function (creep)
{
      creep.say("Im idle!");
      let spawns = creep.room.GetSpawns();
      if (spawns.length > 0) {
            let error = creep.Drive(spawns[0].pos);
      }
};

// Runs this activity.
activity.work = function (creep)
{
      // Just return ok maybe we need to do something 
      // like move off of crowded spots.
      return OK;
};


