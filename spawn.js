
let mod = {};
module.exports = mod;
mod.priorityHigh = [Creep.role.worker, Creep.role.upgrader];
mod.priorityLow = [];
mod.extend = function ()
{
   Spawn.prototype.execute = function ()
   {
      if (this.spawning) {
         return;
      }

      this.spawnByQueue(Spawn.priorityHigh);
      this.spawnByQueue(Spawn.priorityLow);
   }

   // Spawns creeps based on the two priority queues in order
   Spawn.prototype.spawnByQueue = function (queue)
   {
      if (!queue || queue.length == 0) return null;
      let role = queue.shift();
      let cost = 0;
      let parts = role.parts(this.room);
      for (let part of parts) {
         cost += BODYPART_COSTS[part];
      }

      // no parts
      if (cost === 0) {
         // console.log('Zero parts body creep queued. Removed.');
         return false;
      }


      if (cost > this.room.energyAvailable) {
         if (cost > this.room.energyCapacityAvailable) {
            console.log("Queued creep greater then room capacity. " + JSON.stringify(role))
            return false;
         }
         // place back on queue to wait for enough energy.
         queue.unshift(role);
         return true;
      }

      let result = this.create(role, parts);
      return result;
   }

   // Creates a creep.
   Spawn.prototype.create = function (role, body)
   {
      if (body.length == 0 ||
         this.room.TotalRoomRoleCount(role.name) >=
         role.spawnSetup(this.room).maxCount(this.room)) {
         return false;
      }
      var name = this.createCreep(body, null, { CreepRole: role.name });
      if (name != undefined && name != ERR_NOT_ENOUGH_ENERGY) {
         var newCreep = Game.creeps[name];
         newCreep.SetupMemory();
         newCreep.SetRole(role);
      }
      return name;
   }
};

mod.execute = function ()
{
   for (let name in Game.spawns) {
      let spawn = Game.spawns[name];
      spawn.execute();
   }
}
