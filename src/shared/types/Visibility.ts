const visibilities = ["ALL", "EDITORS", "USERS"] as const;

type Visibility = typeof visibilities[number];

const matchVilibilities = (visibility: string): boolean => {
  visibilities.forEach((vis) => {
    if (vis === visibility) return true;
  });
  return false;
};

const defaultVisibility: Visibility = "ALL";

export default Visibility;

export { visibilities, matchVilibilities, defaultVisibility };
