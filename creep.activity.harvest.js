let activity = new Creep.Activity();
module.exports = activity;

activity.name = "harvest";
activity.renewTarget = false;
activity.maxPerTarget = 6;
activity.targetRange = 1;

// Esnures this activity is valid.
activity.isValidActivity = function (creep)
{
      return ((_.sum(creep.carry) < creep.carryCapacity));
};

// Test if this this is a valid target.
activity.isValidTarget = function (target)
{
      return (target !== null && target.energy !== null && target.energy > 0 && target.structureType != STRUCTURE_SPAWN &&
            target.structureType != STRUCTURE_EXTENSION && (target.targetOf === undefined || (target.targetOf.length <= target.GetAccessableFields())));
};

// picks a new target suitable for this activity 
activity.newTarget = function (creep)
{

      let target = null;
      let sourceGuests = 999;
      var roomSources = _.sortBy(creep.room.GetSources(), s => creep.pos.getRangeTo(s));
      for (var iSource = 0; iSource < roomSources.length; iSource++) {
            let source = roomSources[iSource];
            if (creep.GetActivity().isValidTarget(source)) {
                  if (source.targetOf === undefined) {
                        sourceGuests = 0;
                        target = source;
                        break;
                  } else {
                        let guests = _.countBy(source.targetOf, 'creepType');
                        let count = guests[creep.data.creepType];
                        if (!count) {
                              sourceGuests = 0;
                              target = source;
                        } else if (count < sourceGuests) {
                              sourceGuests = count;
                              target = source;
                        }
                  }
            }
      }
      return target;
};

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
      return creep.harvest(creep.GetTarget());
};


