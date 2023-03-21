package com.tickety.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Organization.
 */
@Entity
@Table(name = "organization")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Organization implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "owner")
    private String owner;

    @JsonIgnoreProperties(value = { "organization" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Contact contact;

    @OneToMany(mappedBy = "organization")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "events", "roles", "organization" }, allowSetters = true)
    private Set<UserAccount> userAccounts = new HashSet<>();

    @OneToMany(mappedBy = "organization")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "galery", "artists", "tickets", "userAccount", "organization", "venue" }, allowSetters = true)
    private Set<Event> events = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Organization id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Organization name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOwner() {
        return this.owner;
    }

    public Organization owner(String owner) {
        this.setOwner(owner);
        return this;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public Contact getContact() {
        return this.contact;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }

    public Organization contact(Contact contact) {
        this.setContact(contact);
        return this;
    }

    public Set<UserAccount> getUserAccounts() {
        return this.userAccounts;
    }

    public void setUserAccounts(Set<UserAccount> userAccounts) {
        if (this.userAccounts != null) {
            this.userAccounts.forEach(i -> i.setOrganization(null));
        }
        if (userAccounts != null) {
            userAccounts.forEach(i -> i.setOrganization(this));
        }
        this.userAccounts = userAccounts;
    }

    public Organization userAccounts(Set<UserAccount> userAccounts) {
        this.setUserAccounts(userAccounts);
        return this;
    }

    public Organization addUserAccount(UserAccount userAccount) {
        this.userAccounts.add(userAccount);
        userAccount.setOrganization(this);
        return this;
    }

    public Organization removeUserAccount(UserAccount userAccount) {
        this.userAccounts.remove(userAccount);
        userAccount.setOrganization(null);
        return this;
    }

    public Set<Event> getEvents() {
        return this.events;
    }

    public void setEvents(Set<Event> events) {
        if (this.events != null) {
            this.events.forEach(i -> i.setOrganization(null));
        }
        if (events != null) {
            events.forEach(i -> i.setOrganization(this));
        }
        this.events = events;
    }

    public Organization events(Set<Event> events) {
        this.setEvents(events);
        return this;
    }

    public Organization addEvent(Event event) {
        this.events.add(event);
        event.setOrganization(this);
        return this;
    }

    public Organization removeEvent(Event event) {
        this.events.remove(event);
        event.setOrganization(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Organization)) {
            return false;
        }
        return id != null && id.equals(((Organization) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Organization{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", owner='" + getOwner() + "'" +
            "}";
    }
}
