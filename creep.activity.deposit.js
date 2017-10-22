let activity = new Creep.Activity();
module.exports = activity;

activity.name = "deposit";
activity.renewTarget = false;
activity.maxPerTarget = 6;
activity.targetRange = 1;

// Esnures this activity is valid.
activity.isValidActivity = function (creep)
{
      return (_.sum(creep.carry) > 0) && creep.room.GetEmptyEnergyCapacity() > 0;
};

activity.isValidTarget = function      (target)
{
      return (target !== null &&
            ((target.structureType == STRUCTURE_SPAWN && target.energy < target.energyCapacity) ||
                  (target.structureType == STRUCTURE_EXTENSION && target.energy < target.energyCapacity) ||
                  (target.structureType == STRUCTURE_STORAGE && _.sum(target.store) < target.storeCapacity)))
};

// picks a new target suitable for this activity 
activity.newTarget = function (creep)
{
      let target = null;

      var spawns = creep.room.GetSpawns();
      let extensions = creep.room.GetExtensions();
      let energyOnlyStructures = spawns.concat(extensions);
      // order them to distance from this creep 
      energyOnlyStructures.sort((c) => creep.pos.getRangeTo(c));
      for (let i = 0; i < energyOnlyStructures.length; i++) {
            let depositable = energyOnlyStructures[i];
            if (depositable != null || depositable != undefined) {
                  if (depositable.energy < depositable.energyCapacity) {
                        target = depositable;
                        break;
                  }
            }
      }

      // if depositable is still null put in storage
      if (target == null) {
            let storage = creep.room.GetStorage();
            for (let depositable of storage) {
                  if (depositable.store[RESOURCE_ENERGY] < depositable.storeCapacity) {
                        target = depositable;
                  }
            }

      };
      return target;
}

// order for the creep to execute each tick, when assigned to that action
activity.step = function (creep)
{
      let target = creep.GetTarget();
      let range = creep.pos.getRangeTo(target);
      if (range <= this.targetRange) {
            var workResult = this.work(creep);
            if (workResult != OK) {
                  creep.SetActivity(null);
                  return;
            }
      }
      else {
            if (target != null) {
                  let error = creep.Drive(target.pos);
            }
      }
};

// Runs this activity.
activity.work = function (creep)
{
      return creep.transfer(creep.GetTarget(), RESOURCE_ENERGY);
};





