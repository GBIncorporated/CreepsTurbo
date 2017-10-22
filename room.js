// save original API functions
let find = Room.prototype.find;

let mod = {};
module.exports = mod;

mod.extend = function ()
{
   Room.prototype.GetSourceEnergyAvailable = function ()
   {
      let sources = this.GetSources();
      let energy = _.sum(sources, function (o) { return o.energy; });
      return energy;
   };

   Room.prototype.GetSources = function ()
   {
      return this.find(FIND_SOURCES);
   }

   Room.prototype.GetContainers = function ()
   {
      return this.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER });
   }

   Room.prototype.GetStorage = function ()
   {
      return this.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_STORAGE });
   }

   Room.prototype.GetExtensions = function ()
   {
      return this.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION });
   }

   Room.prototype.GetSpawns = function ()
   {
      return this.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_SPAWN });
   }

   Room.prototype.TotalRoomRoleCount = function (name)
   {
      let creepsInRoom = this.find(FIND_MY_CREEPS, { filter: (s) => s.GetRole().name == name });;

      return creepsInRoom.length;
   };

   Room.prototype.GetEmptyEnergyCapacity = function ()
   {
      let energyCapacity = 0;
      let spawns = this.find(FIND_MY_SPAWNS);
      let containers = this.find(STRUCTURE_CONTAINER);
      let storage = this.find(STRUCTURE_STORAGE);
      energyCapacity += _.sum(spawns, function (o) { return o.energyCapacity - o.energy; });
      energyCapacity += _.sum(containers, function (o)
      {
         o.storeCapacity += _.sum(o.store)
      });

      energyCapacity += _.sum(storage, function (o)
      {
         o.storeCapacity += _.sum(o.store)
      });


      return energyCapacity;

   }
}