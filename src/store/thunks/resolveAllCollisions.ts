// src/store/thunks/resolveAllCollisions.ts

import type { AppDispatch, RootState } from "..";
import type { PositionClass } from "../../features/tree/UtilTree/PositionClass";
import { modifyPeopleAddPerson } from "../personSlice";


export const resolveAllCollisions = (newPosition:PositionClass, depth = 0): any => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const MAX_DEPTH = 10;
    if (depth > MAX_DEPTH) {
      console.warn("🛑 Max recursion depth reached");
      return;
    }

    const people = getState().person.people;
    const collision = newPosition.detectarPrimeraColision(people);

    if (collision) {
      const collisionPeople = [collision.nodoA[0], collision.nodoA[1]];
      const resolvedPeople = newPosition.resolveCollision(people, collisionPeople);

      // Apply the resolved positions
      dispatch(modifyPeopleAddPerson(resolvedPeople));

      // Let Redux update the store, then re-check for further collisions
     // setTimeout(() => {
    //    dispatch(resolveAllCollisions(newPosition, depth + 1));
    //  }, 0);
    } else {
      console.log("✅ All collisions resolved.");
    }
  };
};
