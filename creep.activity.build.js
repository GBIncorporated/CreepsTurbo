let activity = new Creep.Activity();
module.exports = activity;

activity.name = "build";
activity.renewTarget = false;
activity.maxPerTarget = 2;
activity.targetRange = 1;

// Esnures this activity is valid.
activity.isValidActivity = function (creep)
{
   return creep.carry[RESOURCE_ENERGY] > 0 && creep.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0;
};

activity.isValidTarget = function (target)
{
   return (target !== null && target.my && target.progress && target.progress < target.progressTotal);
};

// picks a new target suitable for this activity 
activity.newTarget = function (creep)
{
   let target = null;
   let constructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
   target = creep.pos.findClosestByPath(constructionSites)
   return target;
}
// Runs this activity.
activity.work = function (creep)
{
   return creep.build(creep.GetTarget());
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




